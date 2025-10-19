import {
  FaMountain,
  FaGithub,
  FaArrowRight,
  FaDatabase,
  FaCubes,
  FaEye,
  FaCompress,
} from "react-icons/fa6";

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Image en bandeau vertical à droite avec fondu vers la transparence */}
      <div className="absolute right-0 top-0 h-full w-96 z-0">
        <div className="relative h-full w-full">
          <img
            src="https://raw.githubusercontent.com/Robou/LidarHD/main/images/moine5_ret.jpg"
            alt="Montagne 3D reconstruite en haute définition"
            className="h-full w-full object-cover"
          />
          {/* Fondu vers la transparence de droite à gauche */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-50"></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-6 py-12 pr-96">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              À propos d'AlpHD
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              AlpHD est une version alpha de projet pour une plateforme de
              visualisation 3D dédiée aux sommets alpins. J'utilise les données
              LiDAR haute définition de l'IGN pour créer des modèles 3D
              ultra-précis des montagnes françaises.
            </p>

            {/* Pipeline de traitement */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Le projet
              </h2>

              <div className="space-y-4">
                {/* Étape 1 : Relevés LiDAR */}
                <div className="flex items-start space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaDatabase className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      1. Relevés LiDAR HD de l'IGN
                    </h3>
                    <p className="text-gray-600">
                      Données haute définition collectées par l'Institut
                      national de l'information géographique et forestière
                    </p>
                  </div>
                </div>

                {/* Étape 2 : Reconstruction 3D */}
                <div className="flex items-start space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCubes className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      2. Reconstruction de mesh 3D
                    </h3>
                    <p className="text-gray-600">
                      Algorithmes avancés de reconstruction pour créer des
                      modèles 3D complets et précis, d'une précision inédite.
                    </p>
                  </div>
                </div>

                {/* Étape 3 : Compression */}
                <div className="flex items-start space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaCompress className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      3. Compression optimisée pour le web
                    </h3>
                    <p className="text-gray-600">
                      Réduction de la taille des fichiers tout en préservant la
                      qualité des détails.
                    </p>
                  </div>
                </div>

                {/* Étape 4 : Visualisation */}
                <div className="flex items-start space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaEye className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      4. Viewer web adapté
                    </h3>
                    <p className="text-gray-600">
                      Interface de visualisation optimisée pour l'exploration
                      interactive des modèles 3D, adaptée à la pratique des
                      sports de montagne
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lien GitHub */}
            <div className="pt-4">
              <a
                href="https://github.com/Robou/alphd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-lg"
              >
                <FaGithub className="mr-3 text-xl" aria-hidden="true" />
                Voir le code source sur GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
