export interface VideoItem {
  id: string;
  title: string;
  key: string;
  duration: string;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  videos: VideoItem[];
}

export const MODULES: Module[] = [
  {
    id: "module-1",
    title: "MODULE 1 - LES BASES",
    videos: [
      {
        id: "v1",
        title: "LA BOUGIE JAPONAISE",
        key: "LA BOUGIE JAPONAISE.mp4",
        duration: "12:45",
        description: "Comprendre l'anatomie d'une bougie et ce qu'elle raconte sur la psychologie du marché."
      },
      {
        id: "v2",
        title: "LES POINTS D'ENTREES",
        key: "LES POINTS D'ENTREES.mp4",
        duration: "15:20",
        description: "Identifier les zones de haute probabilité pour placer ses ordres avec précision."
      },
      {
        id: "v3",
        title: "L'ANALYSE TECHNIQUE",
        key: "L'ANALYSE TECHNIQUE.mp4",
        duration: "22:10",
        description: "Maîtriser les structures de marché, supports, résistances et lignes de tendance."
      },
      {
        id: "v4",
        title: "PSYCHOLOGIE INTRODUCTION",
        key: "PSYCHOLOGIE INTRODUCTION.mp4",
        duration: "18:30",
        description: "Pourquoi 90% des traders échouent et comment rejoindre les 10% restants."
      }
    ]
  },
  {
    id: "module-2",
    title: "MODULE 2 - LA DISCIPLINE",
    videos: [
      {
        id: "v5",
        title: "LA DISCIPLINE",
        key: "LA DISCIPLINE.mp4",
        duration: "20:15",
        description: "Le pilier central du trading rentable. Apprendre à respecter son plan sans déroger."
      },
      {
        id: "v6",
        title: "LA PATIENCE",
        key: "LA PATIENCE.mp4",
        duration: "14:50",
        description: "Savoir attendre le setup parfait. Le trading est 90% d'attente et 10% d'exécution."
      },
      {
        id: "v7",
        title: "LE CALENDRIER ECONOMIQUE",
        key: "LE CALENDRIER ECONOMIQUE.mp4",
        duration: "11:25",
        description: "Anticiper les annonces majeures pour éviter la volatilité destructrice."
      },
      {
        id: "v8",
        title: "LE CALENDRIER FOREX",
        key: "LE CALENDRIER FOREX.mp4",
        duration: "13:40",
        description: "Comprendre les sessions de marché (Londres, New York) et leur impact sur les paires."
      }
    ]
  },
  {
    id: "module-3",
    title: "MODULE 3 - LES OUTILS",
    videos: [
      {
        id: "v9",
        title: "MT4 ET PLATEFORME WEB",
        key: "MT4 ET PLATEFORME WEB.mp4",
        duration: "25:00",
        description: "Configuration optimale de vos outils de travail pour une exécution rapide."
      },
      {
        id: "v10",
        title: "LA MANIPULATION DES MARCHES",
        key: "LA MANIPULATION DES MARCHES.mp4",
        duration: "30:45",
        description: "Détecter les pièges des institutions (Smart Money) pour ne plus être la liquidité."
      },
      {
        id: "v11",
        title: "LA SYMBIOSE ROBOT HUMAIN",
        key: "LA SYMBIOSE ROBOT HUMAIN.mp4",
        duration: "28:20",
        description: "Comment utiliser l'assistance algorithmique pour renforcer vos décisions discrétionnaires."
      },
      {
        id: "v12",
        title: "PRESENTATION PLAN CAMELEON",
        key: "PRESENTATION PLAN CAMELEON.mp4",
        duration: "35:00",
        description: "Introduction à la stratégie phare de NGT Academy. S'adapter au marché comme un caméléon."
      }
    ]
  },
  {
    id: "module-4",
    title: "MODULE 4 - LA STRATÉGIE",
    videos: [
      {
        id: "v13",
        title: "VERIFICATION ET PROBABILITE DE GAIN DU CAMELEON",
        key: "VERIFICATION ET PROBABILITE DE GAIN DU CAMELEON.mp4",
        duration: "42:15",
        description: "Analyse statistique et backtesting de la stratégie pour une confiance totale."
      },
      {
        id: "v14",
        title: "LE PLAN CAMELEON EN DAY TRADING",
        key: "LE PLAN CAMELEON EN DAY TRADING.mp4",
        duration: "38:50",
        description: "Application concrète de la méthode sur des horizons de temps intraday."
      },
      {
        id: "v15",
        title: "LE PÉTROLE ET L'OR",
        key: "LE PÉTROLE ET L'OR.mp4",
        duration: "31:20",
        description: "Spécificités du trading sur les matières premières et les métaux précieux."
      },
      {
        id: "v16",
        title: "SCALPING AVEC LE CAMELEON",
        key: "SCALPING AVEC LE CAMELEON.mp4",
        duration: "45:30",
        description: "Techniques d'entrées chirurgicales en M1/M5 pour des profits rapides."
      }
    ]
  }
];
