/**
 * Clothesline — Single tendedero image displayed right below the hero.
 */
export default function Clothesline({ basePath }) {
    return (
        <div className="w-full bg-white">
            <img
                src={`${basePath}/img/tendedero.png`}
                alt="Tendedero de ropa interior"
                className="w-full max-w-2xl mx-auto h-auto block"
            />
        </div>
    );
}
