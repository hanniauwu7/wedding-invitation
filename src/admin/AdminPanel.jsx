import React, { useState, useEffect } from 'react'

const SECTIONS = [
    { id: 'Hero', label: 'Portada (Hero)', icon: '🖼️', description: 'Imagen de fondo, nombres y música' },
    { id: 'Countdown', label: 'Cuenta regresiva', icon: '⏳', description: 'Timer con fecha del evento y botón de agendar' },
    { id: 'Events', label: 'Eventos', icon: '📍', description: 'Ceremonia, recepción con ubicaciones' },
    { id: 'Details', label: 'Detalles', icon: '👔', description: 'Dress code, restricciones de edad' },
    { id: 'Gallery', label: 'Galería de fotos', icon: '📸', description: 'Carrusel de fotos tipo polaroid' },
    { id: 'Gifts', label: 'Mesa de regalos', icon: '🎁', description: 'Links a Amazon, Liverpool, etc.' },
    { id: 'RSVP', label: 'Confirmar asistencia', icon: '💌', description: 'Formulario con WhatsApp' },
]

export default function AdminPanel() {
    const [invitations, setInvitations] = useState([])
    const [loading, setLoading] = useState(true)
    const [showWizard, setShowWizard] = useState(false)
    const [step, setStep] = useState(1)
    const [creating, setCreating] = useState(false)
    const [feedback, setFeedback] = useState(null)
    const [deleting, setDeleting] = useState(null)

    // Wizard form state
    const [form, setForm] = useState({
        eventType: 'boda', // boda, bautizo, xv
        eventTitle: '',
        slug: '',
        // Data for templates
        heroHeading: '',
        heroSubheading: '',
        heroHasMusic: false,
        countdownDateTime: '',
        calendarLocation: '',
        events: [
            { icon: 'church', title: 'Ceremonia', location: '', time: '', mapLink: '' }
        ],
        adultsOnly: false,
        adultsOnlyMessage: '',
        dressCode: '',
        avoidColors: '',
        galleryCount: 4,
        giftsMessage: '',
        giftsLinks: [{ label: '', url: '', icon: '' }],
        giftsEnvelope: false,
        rsvpWhatsapp: '',
        rsvpDeadline: '',
        // Nuevos campos específicos:
        parents: '',
        godparents: '',
        footerMessage: 'Hecho con amor.',
    })

    useEffect(() => {
        fetchInvitations()
    }, [])

    const fetchInvitations = async () => {
        try {
            const res = await fetch('/api/invitations')
            const data = await res.json()
            if (data.ok) setInvitations(data.invitations)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (slug) => {
        if (!confirm(`¿Seguro que quieres eliminar la invitación "${slug}"?`)) return
        setDeleting(slug)
        try {
            const res = await fetch(`/api/invitations/${slug}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.ok) {
                setFeedback({ type: 'success', message: `Invitación "${slug}" eliminada` })
                fetchInvitations()
            } else {
                setFeedback({ type: 'error', message: data.error })
            }
        } catch (e) {
            setFeedback({ type: 'error', message: e.message })
        } finally {
            setDeleting(null)
        }
    }

    const updateForm = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const autoSlug = () => {
        if (form.eventTitle) {
            const slug = form.eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
            updateForm('slug', slug)
        }
    }

    const handleCreate = async () => {
        setCreating(true)
        try {
            const data = {
                slug: form.slug,
                title: form.eventTitle,
                templateName: form.eventType === 'boda' ? 'InvitacionBoda' : (form.eventType === 'bautizo' ? 'InvitacionBautizo' : 'InvitacionXV'),
                config: buildConfig(),
            }

            const res = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const responseData = await res.json()
            if (responseData.ok) {
                const rsvpMsg = responseData.rsvpLink ? ` | 📋 RSVP: ${responseData.rsvpLink}` : ''
                setFeedback({ type: 'success', message: `¡Invitación creada! Disponible en ${responseData.path}${rsvpMsg}` })
                setShowWizard(false)
                setStep(1)
                resetForm()
                fetchInvitations()
            } else {
                setFeedback({ type: 'error', message: responseData.error })
            }
        } catch (e) {
            setFeedback({ type: 'error', message: e.message })
        } finally {
            setCreating(false)
        }
    }

    const buildConfig = () => {
        const cfg = { slug: form.slug }

        // 1. Hero
        cfg.hero = {
            heading: form.heroHeading || (form.eventType === 'boda' ? 'Nos Casamos' : form.eventType === 'bautizo' ? 'Mi Bautizo' : 'Mis XV Años'),
            subheading: form.heroSubheading || form.eventTitle,
            coverImage: 'Portada.jpeg',
            song: form.heroHasMusic ? 'cancion.mp3' : null,
        }

        // Parents and Godparents (for Bautizo and XV)
        if (form.eventType === 'bautizo' || form.eventType === 'xv') {
            cfg.parentsAndGodparents = {
                parents: form.parents || '',
                godparents: form.godparents || ''
            }
        }

        // 2. Countdown / Calendar
        let displayDate = ''
        let displayYear = ''
        let calStart = ''
        let calEnd = ''
        let outStart = ''
        let outEnd = ''

        if (form.countdownDateTime) {
            const date = new Date(form.countdownDateTime)
            const options = { weekday: 'long', day: 'numeric', month: 'long' }
            displayDate = date.toLocaleDateString('es-ES', options).replace(',', '').replace(/(^\w)/, (m) => m.toUpperCase())
            displayYear = date.getFullYear().toString()

            // Google format: YYYYMMDDTHHMMSS
            const end = new Date(date.getTime() + 6 * 60 * 60 * 1000) // Default 6 hrs duration
            const toIsoString = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
            calStart = toIsoString(date)
            calEnd = toIsoString(end)

            // Outlook format: YYYY-MM-DDTHH:MM:SS
            const toLocalIso = (d) => {
                const pad = (n) => n.toString().padStart(2, '0')
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
            }
            outStart = toLocalIso(date)
            outEnd = toLocalIso(end)
        }

        cfg.countdown = {
            dateTime: form.countdownDateTime,
            displayDate,
            displayYear,
        }
        cfg.calendarEvent = {
            title: form.eventTitle,
            description: '¡Te esperamos!',
            location: form.calendarLocation || (form.events[0]?.location) || '',
            start: calStart,
            end: calEnd,
            outlookStart: outStart,
            outlookEnd: outEnd,
        }

        // 3. Events
        cfg.events = form.events.filter((e) => e.title)

        // 4. Details
        cfg.details = {
            adultsOnly: form.adultsOnly,
            adultsOnlyMessage: form.adultsOnlyMessage,
            dressCode: form.dressCode,
            dressCodeImage: 'dresscode.png',
            avoidColors: form.avoidColors,
        }
        // 5. Gallery
        const count = Math.max(1, parseInt(form.galleryCount) || 4)
        cfg.gallery = Array.from({ length: count }).map((_, i) => ({
            filename: `${i + 1}.jpg`,
            caption: '',
        }))
        cfg.galleryTitle = form.eventType === 'boda' ? 'Nuestra Historia' : 'Momentos'

        // 6. Gifts
        cfg.gifts = {
            message: form.giftsMessage,
            links: form.giftsLinks.filter((l) => l.url),
            envelopeOption: form.giftsEnvelope,
        }

        // 7. RSVP
        let deadline = form.rsvpDeadline
        if (!deadline && form.countdownDateTime) {
            // Default deadline: 14 days before the event
            const dDate = new Date(form.countdownDateTime)
            dDate.setDate(dDate.getDate() - 14)
            const options = { day: 'numeric', month: 'long', year: 'numeric' }
            deadline = `Por favor confirma antes del ${dDate.toLocaleDateString('es-ES', options)}`
        }

        cfg.rsvp = {
            whatsapp: form.rsvpWhatsapp,
            deadline: deadline,
        }

        // 8. Footer implicitly from main event title
        cfg.footer = {
            names: form.eventTitle,
            message: form.footerMessage,
        }
        return cfg
    }

    const resetForm = () => {
        setForm({
            eventType: 'boda', eventTitle: '', slug: '',
            heroHeading: '¡Nos Casamos!', heroSubheading: '', heroHasMusic: false,
            countdownDateTime: '', calendarLocation: '',
            events: [{ icon: 'church', title: 'Ceremonia', location: '', time: '', mapLink: '' }, { icon: 'glass', title: 'Recepción', location: '', time: '', mapLink: '' }],
            adultsOnly: false, adultsOnlyMessage: '', dressCode: '', avoidColors: '',
            galleryCount: 4,
            giftsMessage: '', giftsLinks: [{ label: '', url: '', icon: 'fas fa-gift' }], giftsEnvelope: true,
            rsvpWhatsapp: '', rsvpDeadline: '',
            footerMessage: 'Hecho con amor.',
        })
    }

    // --- Dynamic array helpers ---
    const addEvent = () => updateForm('events', [...form.events, { icon: 'glass', title: '', location: '', time: '', mapLink: '' }])
    const removeEvent = (i) => updateForm('events', form.events.filter((_, idx) => idx !== i))
    const updateEvent = (i, field, value) => {
        const events = [...form.events]
        events[i] = { ...events[i], [field]: value }
        updateForm('events', events)
    }

    // Removed Gallery photo array helpers since we use a simple number input now

    const addGiftLink = () => updateForm('giftsLinks', [...form.giftsLinks, { label: '', url: '', icon: '' }])
    const removeGiftLink = (i) => updateForm('giftsLinks', form.giftsLinks.filter((_, idx) => idx !== i))
    const updateGiftLink = (i, field, value) => {
        const links = [...form.giftsLinks]
        links[i] = { ...links[i], [field]: value }
        updateForm('giftsLinks', links)
    }

    return (
        <div className="admin-panel">
            <style>{adminStyles}</style>

            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-inner">
                    <div>
                        <h1 className="admin-title">
                            <span className="admin-logo">🎉</span> Panel de Invitaciones
                        </h1>
                        <p className="admin-subtitle">Gestiona tus invitaciones</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setShowWizard(true); setStep(1) }}>
                        + Nueva Invitación
                    </button>
                </div>
            </header>

            {/* Feedback */}
            {feedback && (
                <div className={`feedback ${feedback.type}`} onClick={() => setFeedback(null)}>
                    {feedback.type === 'success' ? '✅' : '❌'} {feedback.message}
                </div>
            )}

            {/* Invitations Grid */}
            <main className="admin-main">
                {loading ? (
                    <div className="loading-state">Cargando invitaciones...</div>
                ) : invitations.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">📭</p>
                        <p>No hay invitaciones aún</p>
                    </div>
                ) : (
                    <div className="invitation-grid">
                        {invitations.map((inv) => (
                            <div key={inv.slug} className="invitation-card">
                                <div className="card-header">
                                    <span className="card-icon">💍</span>
                                    {inv.isDefault && <span className="badge-default">DEFAULT</span>}
                                </div>
                                <h3 className="card-title">{inv.title}</h3>
                                <p className="card-slug">/i/{inv.slug}</p>
                                <div className="card-actions">
                                    <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="btn-outline">
                                        Ver →
                                    </a>
                                    <a href={inv.rsvpKey ? `/i/${inv.slug}/rsvp?key=${inv.rsvpKey}` : `/i/${inv.slug}/rsvp`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{fontSize: '12px'}}>
                                        📋 Confirmaciones
                                    </a>
                                    {!inv.isDefault && (
                                        <button
                                            className="btn-danger"
                                            disabled={deleting === inv.slug}
                                            onClick={() => handleDelete(inv.slug)}
                                        >
                                            {deleting === inv.slug ? '...' : '🗑️'}
                                        </button>
                                    )}
                                </div>
                                <div style={{marginTop: '16px', background: '#f8f9fa', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e8eaed'}}>
                                    <div style={{fontSize: '12px', fontWeight: '500', color: '#5f6368', marginBottom: '4px'}}>
                                        Link de Invitación:
                                    </div>
                                    <div style={{fontSize: '11px', color: '#1a73e8', wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: '12px'}}>
                                        https://eventos.invita-ya.com/i/{inv.slug}
                                    </div>
                                    
                                    {inv.rsvpKey && (
                                        <>
                                            <div style={{fontSize: '12px', fontWeight: '500', color: '#5f6368', marginBottom: '4px'}}>
                                                Link para Confirmaciones (RSVP):
                                            </div>
                                            <div style={{fontSize: '11px', color: '#1a73e8', wordBreak: 'break-all', fontFamily: 'monospace'}}>
                                                https://eventos.invita-ya.com/i/{inv.slug}/rsvp?key={inv.rsvpKey}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Creation Wizard Modal */}
            {showWizard && (
                <div className="modal-overlay" onClick={() => setShowWizard(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowWizard(false)}>✕</button>

                        {/* Step indicators */}
                        <div className="steps-bar">
                            {[1, 3, 4].map((s, idx) => (
                                <div key={s} className={`step-dot ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
                                    {idx + 1}
                                </div>
                            ))}
                        </div>

                        {/* Step 1: Datos básicos */}
                        {step === 1 && (
                            <div className="step-content">
                                <h2 className="step-title">Datos Básicos</h2>
                                <p className="step-desc">Información principal del evento</p>

                                <div className="form-group">
                                    <label>Tipo de evento</label>
                                    <div className="event-type-grid">
                                        {[
                                            { id: 'boda', icon: '💍', label: 'Boda' },
                                            { id: 'xv', icon: '👑', label: 'XV Años' },
                                            { id: 'bautizo', icon: '⛪', label: 'Bautizo' },
                                        ].map((type) => (
                                            <div
                                                key={type.id}
                                                className={`event-type-card ${form.eventType === type.id ? 'selected' : ''}`}
                                                onClick={() => updateForm('eventType', type.id)}
                                            >
                                                <span className="event-type-icon">{type.icon}</span>
                                                <span className="event-type-label">{type.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Título de la invitación</label>
                                    <input
                                        type="text"
                                        placeholder={form.eventType === 'boda' ? 'Ej: Kassandra & Brian' : form.eventType === 'cumpleanos' ? 'Ej: Cumpleaños de Sofía' : form.eventType === 'bautizo' ? 'Ej: Bautizo de Santiago' : form.eventType === 'xv' ? 'Ej: XV Años de Valentina' : 'Ej: Nombre del evento'}
                                        value={form.eventTitle}
                                        onChange={(e) => updateForm('eventTitle', e.target.value)}
                                        onBlur={autoSlug}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Slug (URL)</label>
                                    <div className="slug-preview">
                                        <span className="slug-prefix">/i/</span>
                                        <input
                                            type="text" placeholder="kassandra-brian"
                                            value={form.slug}
                                            onChange={(e) => updateForm('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        />
                                    </div>
                                </div>

                                <div className="step-actions">
                                    <button className="btn-primary" disabled={!form.eventTitle || !form.slug} onClick={() => setStep(3)}>
                                        Siguiente →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Configurar datos por sección */}
                        {step === 3 && (
                            <div className="step-content step-config">
                                <h2 className="step-title">Configurar Datos de {form.eventType === 'boda' ? 'la Boda' : (form.eventType === 'bautizo' ? 'el Bautizo' : 'los XV Años')}</h2>
                                <p className="step-desc">Llena los datos que aparecerán en la plantilla</p>

                                <div className="config-sections">
                                    <fieldset className="config-fieldset">
                                        <legend>🖼️ Portada (Hero)</legend>
                                        <div className="form-group">
                                            <label>Título principal (ej. ¡Nos Casamos! / Mi Bautizo)</label>
                                            <input value={form.heroHeading} onChange={(e) => updateForm('heroHeading', e.target.value)} placeholder="Ej. ¡Nos Casamos!" />
                                        </div>
                                        <div className="form-group">
                                            <label>Nombres principales (dejar vacío para usar el título del evento)</label>
                                            <input value={form.heroSubheading} onChange={(e) => updateForm('heroSubheading', e.target.value)} placeholder={form.eventTitle.toUpperCase()} />
                                        </div>
                                        <div className="form-group checkbox-group" style={{ marginTop: '16px' }}>
                                            <label>
                                                <input type="checkbox" checked={form.heroHasMusic} onChange={(e) => updateForm('heroHasMusic', e.target.checked)} />
                                                Incluir reproductor de música de fondo
                                            </label>
                                        </div>
                                        <p className="form-hint" style={{ marginTop: '12px' }}>
                                            ✨ <b>Recomendación multimedia:</b> Guarda la imagen principal como <code>Portada.jpeg</code> en <code>public/invitations/{form.slug}/img/</code>.
                                            <br/>{form.heroHasMusic && <>🎵 Guarda tu canción como <code>cancion.mp3</code> en la carpeta <code>audio/</code>.</>}
                                        </p>
                                    </fieldset>

                                    {(form.eventType === 'bautizo' || form.eventType === 'xv') && (
                                    <fieldset className="config-fieldset">
                                        <legend>👨‍👩‍👦 Padres y Padrinos</legend>
                                        <div className="form-group">
                                            <label>Con la bendición de mis padres (nombres)</label>
                                            <input value={form.parents} onChange={(e) => updateForm('parents', e.target.value)} placeholder="Ej: María Pérez y Juan García" />
                                        </div>
                                        <div className="form-group">
                                            <label>Y mis padrinos (nombres)</label>
                                            <input value={form.godparents} onChange={(e) => updateForm('godparents', e.target.value)} placeholder="Ej: Ana López y Carlos Sánchez" />
                                        </div>
                                    </fieldset>
                                    )}

                                    <fieldset className="config-fieldset">
                                        <legend>⏳ Cuenta Regresiva</legend>
                                        <div className="form-row">
                                            <div className="form-group" style={{ flex: 1 }}>
                                                <label>Fecha y hora del evento *</label>
                                                <input type="datetime-local" value={form.countdownDateTime} onChange={(e) => updateForm('countdownDateTime', e.target.value)} />
                                            </div>
                                            <div className="form-group" style={{ flex: 1 }}>
                                                <label>Ubicación general (para Google Calendar)</label>
                                                <input value={form.calendarLocation} onChange={(e) => updateForm('calendarLocation', e.target.value)} placeholder="Ej: Hacienda San José" />
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset className="config-fieldset">
                                        <legend>📍 Eventos programados</legend>
                                        {form.events.map((event, i) => (
                                            <div key={i} className="config-subcard">
                                                <div className="subcard-header">
                                                    <strong>Evento {i + 1}</strong>
                                                    {form.events.length > 1 && <button className="btn-remove" onClick={() => removeEvent(i)}>✕</button>}
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Icono</label>
                                                        <select value={event.icon} onChange={(e) => updateEvent(i, 'icon', e.target.value)}>
                                                            <option value="church">⛪ Iglesia</option>
                                                            <option value="glass">🥂 Recepción</option>
                                                            <option value="star">⭐ Otro</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Título (ej. Ceremonia Religiosa)</label>
                                                        <input value={event.title} onChange={(e) => updateEvent(i, 'title', e.target.value)} placeholder="Ceremonia" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Ubicación o Nombre del lugar</label>
                                                    <input value={event.location} onChange={(e) => updateEvent(i, 'location', e.target.value)} placeholder="Parroquia del Sagrado Corazón" />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Hora</label>
                                                        <input type="time" value={event.time} onChange={(e) => updateEvent(i, 'time', e.target.value)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Link Google Maps</label>
                                                        <input value={event.mapLink} onChange={(e) => updateEvent(i, 'mapLink', e.target.value)} placeholder="https://maps.app.goo.gl/..." />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="btn-add" onClick={addEvent}>+ Agregar evento</button>
                                    </fieldset>

                                    <fieldset className="config-fieldset">
                                        <legend>👔 Detalles y Dress Code</legend>
                                        <div className="form-group checkbox-group">
                                            <label>
                                                <input type="checkbox" checked={form.adultsOnly} onChange={(e) => updateForm('adultsOnly', e.target.checked)} />
                                                Es un evento "Solo Adultos"
                                            </label>
                                        </div>
                                        {form.adultsOnly && (
                                            <div className="form-group">
                                                <label>Mensaje de restricción (opcional)</label>
                                                <input value={form.adultsOnlyMessage} onChange={(e) => updateForm('adultsOnlyMessage', e.target.value)} placeholder="Amamos a los niños, pero..." />
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label>Código de Vestimenta</label>
                                            <input value={form.dressCode} onChange={(e) => updateForm('dressCode', e.target.value)} placeholder="FORMAL / ETIQUETA / RELAJADO" />
                                        </div>
                                        <div className="form-group">
                                            <label>Colores a evitar (ej. Boda: "Blanco", Bautizo: "Colores oscuros")</label>
                                            <input value={form.avoidColors} onChange={(e) => updateForm('avoidColors', e.target.value)} placeholder="Reservado para la novia..." />
                                        </div>
                                        <p className="form-hint" style={{ marginTop: '12px' }}>
                                            ✨ Opcional: Guarda <code>dresscode.png</code> en <code>public/invitations/{form.slug}/img/</code> para mostrar un ejemplo visual.
                                        </p>
                                    </fieldset>

                                    <fieldset className="config-fieldset">
                                        <legend>📸 Galería de Fotos</legend>
                                        <div className="form-group" style={{ maxWidth: '300px' }}>
                                            <label>¿Cuántas fotos tendrá la galería?</label>
                                            <input type="number" min="1" max="20" value={form.galleryCount} onChange={(e) => updateForm('galleryCount', e.target.value)} />
                                        </div>
                                        <p className="form-hint" style={{ marginTop: '12px' }}>
                                            ✨ Nombra tus fotos como <b>1.jpg, 2.jpg...</b> hasta llegar a tu número, en <code>public/invitations/{form.slug}/img/</code>.
                                        </p>
                                    </fieldset>

                                    <fieldset className="config-fieldset">
                                        <legend>🎁 Mesa de Regalos / Lluvia de Sobres</legend>
                                        <div className="form-group">
                                            <label>Mensaje introductorio</label>
                                            <input value={form.giftsMessage} onChange={(e) => updateForm('giftsMessage', e.target.value)} placeholder="Su presencia es el mejor regalo, pero si lo desean..." />
                                        </div>
                                        {form.giftsLinks.map((link, i) => (
                                            <div key={i} className="config-subcard compact">
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Etiqueta (ej. Amazon)</label>
                                                        <input value={link.label} onChange={(e) => updateGiftLink(i, 'label', e.target.value)} placeholder="Mesa en Liverpool" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>URL</label>
                                                        <input value={link.url} onChange={(e) => updateGiftLink(i, 'url', e.target.value)} placeholder="https://..." />
                                                    </div>
                                                    {form.giftsLinks.length > 1 && <button className="btn-remove inline" onClick={() => removeGiftLink(i)}>✕</button>}
                                                </div>
                                            </div>
                                        ))}
                                        <button className="btn-add" onClick={addGiftLink}>+ Agregar link de tienda</button>
                                        <div className="form-group checkbox-group" style={{ marginTop: '16px' }}>
                                            <label>
                                                <input type="checkbox" checked={form.giftsEnvelope} onChange={(e) => updateForm('giftsEnvelope', e.target.checked)} />
                                                Incluir opción visual de "Lluvia de sobres"
                                            </label>
                                        </div>
                                    </fieldset>
                                    <fieldset className="config-fieldset">
                                        <legend>💌 Confirmar Asistencia</legend>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>WhatsApp (con código de país)</label>
                                                <input value={form.rsvpWhatsapp} onChange={(e) => updateForm('rsvpWhatsapp', e.target.value)} placeholder="524492905708" />
                                            </div>
                                            <div className="form-group">
                                                <label>Fecha límite de confirmación (Dejar vacío para auto-calcular a 14 días antes del evento)</label>
                                                <input value={form.rsvpDeadline} onChange={(e) => updateForm('rsvpDeadline', e.target.value)} placeholder="Opcional. Ej: 15 de Mayo" />
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>

                                <div className="step-actions">
                                    <button className="btn-secondary" onClick={() => setStep(1)}>← Atrás</button>
                                    <button className="btn-primary" onClick={() => setStep(4)}>Siguiente →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirmación */}
                        {step === 4 && (
                            <div className="step-content">
                                <h2 className="step-title">Confirmar Creación</h2>
                                <p className="step-desc">Revisa y confirma los datos de la invitación</p>

                                <div className="summary-card">
                                    <div className="summary-row">
                                        <span className="summary-label">Evento</span>
                                        <span className="summary-value">{form.eventTitle}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span className="summary-label">URL</span>
                                        <span className="summary-value code">/i/{form.slug}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span className="summary-label">Plantilla</span>
                                        <span className="summary-value">
                                            {form.eventType === 'boda' ? 'InvitacionBoda' : (form.eventType === 'bautizo' ? 'InvitacionBautizo' : 'InvitacionXV')}
                                        </span>
                                    </div>
                                </div>

                                <div className="summary-note">
                                    <p>📁 Se crearán las carpetas:</p>
                                    <code>src/invitations/{form.slug}/</code><br />
                                    <code>public/invitations/{form.slug}/img/</code><br />
                                    <code>public/invitations/{form.slug}/audio/</code>
                                    <p style={{ marginTop: '12px' }}>📄 Se actualizará <code>registry.js</code> automáticamente</p>
                                </div>

                                <div className="step-actions">
                                    <button className="btn-secondary" onClick={() => setStep(3)}>← Atrás</button>
                                    <button className="btn-primary btn-create" disabled={creating} onClick={handleCreate}>
                                        {creating ? 'Creando...' : '🚀 Crear Invitación'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── STYLES ─────────────────────────────────────────────────────
const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500&display=swap');
  .admin-panel {
    min-height: 100vh;
    background: #f8f9fa;
    color: #202124;
    font-family: 'Google Sans', 'Roboto', system-ui, sans-serif;
  }
  .admin-header {
    background: #fff;
    border-bottom: 1px solid #dadce0;
    padding: 16px 32px;
    box-shadow: 0 1px 3px rgba(60,64,67,0.08);
  }
  .admin-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  .admin-title {
    font-size: 1.375rem;
    font-weight: 500;
    color: #202124;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .admin-logo { font-size: 1.6rem; }
  .admin-subtitle {
    font-size: 0.8rem;
    color: #5f6368;
    margin-top: 4px;
  }
  .admin-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px;
  }

  /* Buttons */
  .btn-primary {
    background: #1a73e8;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 24px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    font-family: inherit;
    box-shadow: 0 1px 3px rgba(26,115,232,0.3);
  }
  .btn-primary:hover { background: #1765cc; box-shadow: 0 2px 6px rgba(26,115,232,0.35); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-secondary {
    background: #fff;
    color: #1a73e8;
    border: 1px solid #dadce0;
    padding: 10px 24px;
    border-radius: 24px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    font-family: inherit;
  }
  .btn-secondary:hover { background: #f1f3f4; }
  .btn-outline {
    background: #fff;
    color: #1a73e8;
    border: 1px solid #dadce0;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    font-size: 0.8rem;
    transition: all 0.2s;
    font-family: inherit;
  }
  .btn-outline:hover { background: #e8f0fe; border-color: #1a73e8; }
  .btn-danger {
    background: transparent;
    color: #d93025;
    border: 1px solid #dadce0;
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-danger:hover { background: #fce8e6; border-color: #d93025; }
  .btn-danger:disabled { opacity: 0.5; }
  .btn-add {
    background: transparent;
    color: #1a73e8;
    border: 1px dashed #dadce0;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    width: 100%;
    margin-top: 8px;
    transition: all 0.2s;
    font-family: inherit;
  }
  .btn-add:hover { background: #e8f0fe; border-color: #1a73e8; }
  .btn-remove {
    background: #fce8e6;
    color: #d93025;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .btn-remove.inline { align-self: flex-end; margin-bottom: 12px; flex-shrink: 0; }
  .btn-remove:hover { background: #d93025; color: white; }
  .btn-create {
    padding: 14px 32px;
    font-size: 1rem;
  }

  /* Feedback */
  .feedback {
    max-width: 1200px;
    margin: 16px auto 0;
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 0.9rem;
    cursor: pointer;
    animation: slideDown 0.3s ease;
  }
  .feedback.success { background: #e6f4ea; color: #137333; border: 1px solid #ceead6; }
  .feedback.error { background: #fce8e6; color: #c5221f; border: 1px solid #f5c6cb; }

  /* Grid */
  .invitation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  .invitation-card {
    background: #fff;
    border: 1px solid #dadce0;
    border-radius: 12px;
    padding: 20px 24px;
    transition: all 0.2s;
  }
  .invitation-card:hover { box-shadow: 0 1px 6px rgba(60,64,67,0.15); border-color: #1a73e8; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .card-icon { font-size: 2rem; }
  .badge-default {
    background: #e8f0fe;
    color: #1a73e8;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .card-title { font-size: 1rem; font-weight: 500; color: #202124; }
  .card-slug { color: #5f6368; font-size: 0.8rem; margin: 4px 0 14px; font-family: monospace; }
  .card-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* Empty & loading */
  .empty-state, .loading-state {
    text-align: center;
    padding: 80px 20px;
    color: #5f6368;
    font-size: 1rem;
  }
  .empty-icon { font-size: 3rem; margin-bottom: 12px; }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.32);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 720px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 28px 32px;
    position: relative;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    scrollbar-width: thin;
    scrollbar-color: #dadce0 transparent;
  }
  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: #f1f3f4;
    border: none;
    color: #5f6368;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .modal-close:hover { background: #e8eaed; color: #202124; }

  /* Steps */
  .steps-bar {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 32px;
  }
  .step-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f1f3f4;
    color: #80868b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 0.8rem;
    transition: all 0.3s;
  }
  .step-dot.active { background: #e8f0fe; color: #1a73e8; }
  .step-dot.current { background: #1a73e8; color: white; }
  .step-content { animation: fadeIn 0.3s ease; }
  .step-title { font-size: 1.25rem; font-weight: 500; color: #202124; margin-bottom: 4px; }
  .step-desc { color: #5f6368; margin-bottom: 20px; font-size: 0.875rem; }
  .step-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e8eaed;
  }
  .step-config { max-height: 60vh; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #dadce0 transparent; padding-right: 4px; }

  /* Form styles */
  .form-group {
    margin-bottom: 16px;
    flex: 1;
  }
  .form-group label {
    display: block;
    font-size: 0.8rem;
    color: #5f6368;
    margin-bottom: 6px;
    font-weight: 500;
  }
  .form-group input, .form-group select {
    width: 100%;
    padding: 10px 14px;
    background: #fff;
    border: 1px solid #dadce0;
    border-radius: 8px;
    color: #202124;
    font-size: 0.875rem;
    transition: border-color 0.2s;
    font-family: inherit;
    box-sizing: border-box;
  }
  .form-group input:focus, .form-group select:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26,115,232,0.15);
  }
  .form-group small, .form-hint {
    display: block;
    color: #80868b;
    font-size: 0.75rem;
    margin-top: 4px;
  }
  .form-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .slug-preview {
    display: flex;
    align-items: stretch;
  }
  .slug-prefix {
    background: #f1f3f4;
    padding: 10px 12px;
    border-radius: 8px 0 0 8px;
    border: 1px solid #dadce0;
    border-right: none;
    color: #5f6368;
    font-family: monospace;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
  }
  .slug-preview input {
    border-radius: 0 8px 8px 0 !important;
    font-family: monospace;
  }
  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #3c4043;
  }
  .checkbox-group input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #1a73e8;
  }

  /* Sections grid */
  .sections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }
  .section-card {
    background: #fff;
    border: 2px solid #dadce0;
    border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .section-card:hover { border-color: #80868b; }
  .section-card.selected { border-color: #1a73e8; background: #e8f0fe; }
  .section-card.locked { opacity: 0.7; cursor: not-allowed; border-color: #1a73e8; background: #e8f0fe; }
  .section-check {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #e8eaed;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: white;
    font-weight: 700;
  }
  .section-card.selected .section-check { background: #1a73e8; }
  .section-icon { font-size: 1.4rem; display: block; margin-bottom: 6px; }
  .section-label { display: block; font-weight: 500; font-size: 0.85rem; color: #202124; }
  .section-desc { display: block; font-size: 0.75rem; color: #5f6368; margin-top: 3px; }

  /* Config fieldsets */
  .config-fieldset {
    border: 1px solid #dadce0;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    background: #fff;
  }
  .config-fieldset legend {
    font-weight: 500;
    font-size: 0.9rem;
    color: #1a73e8;
    padding: 0 8px;
  }
  .config-subcard {
    background: #f8f9fa;
    border: 1px solid #e8eaed;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 10px;
  }
  .config-subcard.compact { padding: 12px; }
  .subcard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    color: #5f6368;
    font-size: 0.85rem;
  }

  /* Summary */
  .summary-card {
    background: #f8f9fa;
    border: 1px solid #e8eaed;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e8eaed;
  }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { color: #5f6368; font-size: 0.85rem; }
  .summary-value { color: #202124; font-weight: 500; }
  .summary-value.code { font-family: monospace; color: #1a73e8; }
  .summary-note {
    background: #e8f0fe;
    border-radius: 10px;
    padding: 16px;
    font-size: 0.85rem;
    color: #3c4043;
  }
  .summary-note code {
    background: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
    color: #1a73e8;
    border: 1px solid #dadce0;
  }

  /* Event type grid */
  .event-type-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 4px;
  }
  .event-type-card {
    background: #fff;
    border: 2px solid #dadce0;
    border-radius: 10px;
    padding: 14px 8px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
  }
  .event-type-card:hover { border-color: #80868b; background: #f8f9fa; }
  .event-type-card.selected { border-color: #1a73e8; background: #e8f0fe; }
  .event-type-icon { font-size: 1.4rem; display: block; margin-bottom: 4px; }
  .event-type-label { font-size: 0.8rem; font-weight: 500; color: #5f6368; }
  .event-type-card.selected .event-type-label { color: #1a73e8; }

  /* Animations */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

  /* Scrollbar */
  .modal::-webkit-scrollbar, .step-config::-webkit-scrollbar { width: 6px; }
  .modal::-webkit-scrollbar-track, .step-config::-webkit-scrollbar-track { background: transparent; }
  .modal::-webkit-scrollbar-thumb, .step-config::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 3px; }
`
