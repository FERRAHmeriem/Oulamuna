import React from 'react'
import ArticleCard from './ArticleCard';
import image1 from "../testingImages/image1.jpg"
import image2 from "../testingImages/image2.jpg"
import image3 from "../testingImages/image3.jpg"
const articles = [
  {
    "title": "L'engagement de Abdelhamid Ben Badis pour l'éducation",
    "description": "Abdelhamid Ben Badis a consacré sa vie à la diffusion du savoir dans un contexte colonial difficile. À travers des écoles et des enseignements novateurs, il a permis l’éveil d’une génération prête à défendre son identité nationale. Son approche était centrée sur la pédagogie islamique moderne, conjuguant foi, science et ouverture au monde.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Éducation",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Abdelhamid Ben Badis et la construction de l'identité algérienne",
    "description": "L’œuvre de Abdelhamid Ben Badis s’inscrit dans la résistance intellectuelle à la domination coloniale. En mettant en avant l’histoire, la langue et la foi, il a restauré chez les Algériens la fierté d’être eux-mêmes. Son discours, profondément enraciné dans les valeurs nationales, a contribué à forger l’unité du peuple.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Identité nationale",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Réformes religieuses proposées par Abdelhamid Ben Badis",
    "description": "Réformateur dans l’âme, Abdelhamid Ben Badis souhaitait purifier l’islam des pratiques étrangères à sa source. Il prônait un retour aux textes fondamentaux, dans une lecture adaptée à son époque. Sa pensée religieuse était critique, moderne, et en phase avec les défis sociaux et politiques de son temps.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Réforme religieuse",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Spiritualité dans la pensée de Abdelhamid Ben Badis",
    "description": "La spiritualité était au cœur de la démarche de Abdelhamid Ben Badis. Pour lui, la foi ne se limitait pas aux rituels, mais s’exprimait dans le comportement, la justice et le service de la communauté. Il insistait sur une religion vécue intérieurement, fondée sur la sincérité et l’exemplarité.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Spiritualité",
    "imageArticle": {
      "url":image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "La langue et la culture chez Abdelhamid Ben Badis",
    "description": "La défense de la langue était pour Abdelhamid Ben Badis un acte de résistance. Il la considérait comme un vecteur fondamental de la culture et de l’identité. En écrivant, enseignant et publiant, il s’opposa à la francisation et œuvra à la renaissance linguistique et culturelle de l’Algérie.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Linguistique",
    "imageArticle": {
      "url":image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'éthique dans la vie de Abdelhamid Ben Badis",
    "description": "Abdelhamid Ben Badis incarnait une éthique rigoureuse. Son intégrité, sa sincérité et son engagement faisaient de lui un modèle. Il refusa les compromissions, défendit les plus faibles et fit toujours passer l’intérêt général avant ses intérêts personnels. Sa vie fut un exemple de droiture morale.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Éthique",
    "imageArticle": {
      "url":image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'engagement de Khaled El Hassani Ben El Hachmi pour l'éducation",
    "description": "Khaled El Hassani Ben El Hachmi a consacré sa vie à la diffusion du savoir dans un contexte colonial difficile. À travers des écoles et des enseignements novateurs, il a permis l’éveil d’une génération prête à défendre son identité nationale. Son approche était centrée sur la pédagogie islamique moderne, conjuguant foi, science et ouverture au monde.",
    "scholarName": "Khaled El Hassani Ben El Hachmi",
    "scholarId": 2,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Éducation",
    "imageArticle": {
      "url":image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Khaled El Hassani Ben El Hachmi et la construction de l'identité algérienne",
    "description": "L’œuvre de Khaled El Hassani Ben El Hachmi s’inscrit dans la résistance intellectuelle à la domination coloniale. En mettant en avant l’histoire, la langue et la foi, il a restauré chez les Algériens la fierté d’être eux-mêmes. Son discours, profondément enraciné dans les valeurs nationales, a contribué à forger l’unité du peuple.",
    "scholarName": "Khaled El Hassani Ben El Hachmi",
    "scholarId": 2,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Identité nationale",
    "imageArticle": {
      "url":image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Réformes religieuses proposées par Khaled El Hassani Ben El Hachmi",
    "description": "Réformateur dans l’âme, Khaled El Hassani Ben El Hachmi souhaitait purifier l’islam des pratiques étrangères à sa source. Il prônait un retour aux textes fondamentaux, dans une lecture adaptée à son époque. Sa pensée religieuse était critique, moderne, et en phase avec les défis sociaux et politiques de son temps.",
    "scholarName": "Khaled El Hassani Ben El Hachmi",
    "scholarId": 2,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Réforme religieuse",
    "imageArticle": {
      "url":image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Spiritualité dans la pensée de Khaled El Hassani Ben El Hachmi",
    "description": "La spiritualité était au cœur de la démarche de Khaled El Hassani Ben El Hachmi. Pour lui, la foi ne se limitait pas aux rituels, mais s’exprimait dans le comportement, la justice et le service de la communauté. Il insistait sur une religion vécue intérieurement, fondée sur la sincérité et l’exemplarité.",
    "scholarName": "Khaled El Hassani Ben El Hachmi",
    "scholarId": 2,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Spiritualité",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "La langue et la culture chez Khaled El Hassani Ben El Hachmi",
    "description": "La défense de la langue était pour Khaled El Hassani Ben El Hachmi un acte de résistance. Il la considérait comme un vecteur fondamental de la culture et de l’identité. En écrivant, enseignant et publiant, il s’opposa à la francisation et œuvra à la renaissance linguistique et culturelle de l’Algérie.",
    "scholarName": "Khaled El Hassani Ben El Hachmi",
    "scholarId": 2,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Linguistique",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'éthique dans la vie de Khaled El Hassani Ben El Hachmi",
    "description": "Khaled El Hassani Ben El Hachmi incarnait une éthique rigoureuse. Son intégrité, sa sincérité et son engagement faisaient de lui un modèle. Il refusa les compromissions, défendit les plus faibles et fit toujours passer l’intérêt général avant ses intérêts personnels. Sa vie fut un exemple de droiture morale.",
    "scholarName": "Khaled El Hassani Ben El Hachmi",
    "scholarId": 2,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Éthique",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'engagement de Alarbi Tbassi pour l'éducation",
    "description": "Alarbi Tbassi a consacré sa vie à la diffusion du savoir dans un contexte colonial difficile. À travers des écoles et des enseignements novateurs, il a permis l’éveil d’une génération prête à défendre son identité nationale. Son approche était centrée sur la pédagogie islamique moderne, conjuguant foi, science et ouverture au monde.",
    "scholarName": "Alarbi Tbassi",
    "scholarId": 3,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Éducation",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Alarbi Tbassi et la construction de l'identité algérienne",
    "description": "L’œuvre de Alarbi Tbassi s’inscrit dans la résistance intellectuelle à la domination coloniale. En mettant en avant l’histoire, la langue et la foi, il a restauré chez les Algériens la fierté d’être eux-mêmes. Son discours, profondément enraciné dans les valeurs nationales, a contribué à forger l’unité du peuple.",
    "scholarName": "Alarbi Tbassi",
    "scholarId": 3,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Identité nationale",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Réformes religieuses proposées par Alarbi Tbassi",
    "description": "Réformateur dans l’âme, Alarbi Tbassi souhaitait purifier l’islam des pratiques étrangères à sa source. Il prônait un retour aux textes fondamentaux, dans une lecture adaptée à son époque. Sa pensée religieuse était critique, moderne, et en phase avec les défis sociaux et politiques de son temps.",
    "scholarName": "Alarbi Tbassi",
    "scholarId": 3,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Réforme religieuse",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Spiritualité dans la pensée de Alarbi Tbassi",
    "description": "La spiritualité était au cœur de la démarche de Alarbi Tbassi. Pour lui, la foi ne se limitait pas aux rituels, mais s’exprimait dans le comportement, la justice et le service de la communauté. Il insistait sur une religion vécue intérieurement, fondée sur la sincérité et l’exemplarité.",
    "scholarName": "Alarbi Tbassi",
    "scholarId": 3,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Spiritualité",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "La langue et la culture chez Alarbi Tbassi",
    "description": "La défense de la langue était pour Alarbi Tbassi un acte de résistance. Il la considérait comme un vecteur fondamental de la culture et de l’identité. En écrivant, enseignant et publiant, il s’opposa à la francisation et œuvra à la renaissance linguistique et culturelle de l’Algérie.",
    "scholarName": "Alarbi Tbassi",
    "scholarId": 3,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Linguistique",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'éthique dans la vie de Alarbi Tbassi",
    "description": "Alarbi Tbassi incarnait une éthique rigoureuse. Son intégrité, sa sincérité et son engagement faisaient de lui un modèle. Il refusa les compromissions, défendit les plus faibles et fit toujours passer l’intérêt général avant ses intérêts personnels. Sa vie fut un exemple de droiture morale.",
    "scholarName": "Alarbi Tbassi",
    "scholarId": 3,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Éthique",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'engagement de Malek Bennabi pour l'éducation",
    "description": "Malek Bennabi a consacré sa vie à la diffusion du savoir dans un contexte colonial difficile. À travers des écoles et des enseignements novateurs, il a permis l’éveil d’une génération prête à défendre son identité nationale. Son approche était centrée sur la pédagogie islamique moderne, conjuguant foi, science et ouverture au monde.",
    "scholarName": "Malek Bennabi",
    "scholarId": 4,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Éducation",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Malek Bennabi et la construction de l'identité algérienne",
    "description": "L’œuvre de Malek Bennabi s’inscrit dans la résistance intellectuelle à la domination coloniale. En mettant en avant l’histoire, la langue et la foi, il a restauré chez les Algériens la fierté d’être eux-mêmes. Son discours, profondément enraciné dans les valeurs nationales, a contribué à forger l’unité du peuple.",
    "scholarName": "Malek Bennabi",
    "scholarId": 4,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Identité nationale",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Réformes religieuses proposées par Malek Bennabi",
    "description": "Réformateur dans l’âme, Malek Bennabi souhaitait purifier l’islam des pratiques étrangères à sa source. Il prônait un retour aux textes fondamentaux, dans une lecture adaptée à son époque. Sa pensée religieuse était critique, moderne, et en phase avec les défis sociaux et politiques de son temps.",
    "scholarName": "Malek Bennabi",
    "scholarId": 4,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Réforme religieuse",
    "imageArticle": {
      "url": image3
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Spiritualité dans la pensée de Malek Bennabi",
    "description": "La spiritualité était au cœur de la démarche de Malek Bennabi. Pour lui, la foi ne se limitait pas aux rituels, mais s’exprimait dans le comportement, la justice et le service de la communauté. Il insistait sur une religion vécue intérieurement, fondée sur la sincérité et l’exemplarité.",
    "scholarName": "Malek Bennabi",
    "scholarId": 4,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Spiritualité",
    "imageArticle": {
      "url": image3
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "La langue et la culture chez Malek Bennabi",
    "description": "La défense de la langue était pour Malek Bennabi un acte de résistance. Il la considérait comme un vecteur fondamental de la culture et de l’identité. En écrivant, enseignant et publiant, il s’opposa à la francisation et œuvra à la renaissance linguistique et culturelle de l’Algérie.",
    "scholarName": "Malek Bennabi",
    "scholarId": 4,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Linguistique",
    "imageArticle": {
      "url": image3
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'éthique dans la vie de Malek Bennabi",
    "description": "Malek Bennabi incarnait une éthique rigoureuse. Son intégrité, sa sincérité et son engagement faisaient de lui un modèle. Il refusa les compromissions, défendit les plus faibles et fit toujours passer l’intérêt général avant ses intérêts personnels. Sa vie fut un exemple de droiture morale.",
    "scholarName": "Malek Bennabi",
    "scholarId": 4,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Éthique",
    "imageArticle": {
      "url": image3
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'engagement de Moufdi Zakaria pour l'éducation",
    "description": "Moufdi Zakaria a consacré sa vie à la diffusion du savoir dans un contexte colonial difficile. À travers des écoles et des enseignements novateurs, il a permis l’éveil d’une génération prête à défendre son identité nationale. Son approche était centrée sur la pédagogie islamique moderne, conjuguant foi, science et ouverture au monde.",
    "scholarName": "Moufdi Zakaria",
    "scholarId": 5,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Éducation",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Moufdi Zakaria et la construction de l'identité algérienne",
    "description": "L’œuvre de Moufdi Zakaria s’inscrit dans la résistance intellectuelle à la domination coloniale. En mettant en avant l’histoire, la langue et la foi, il a restauré chez les Algériens la fierté d’être eux-mêmes. Son discours, profondément enraciné dans les valeurs nationales, a contribué à forger l’unité du peuple.",
    "scholarName": "Moufdi Zakaria",
    "scholarId": 5,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Identité nationale",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Réformes religieuses proposées par Moufdi Zakaria",
    "description": "Réformateur dans l’âme, Moufdi Zakaria souhaitait purifier l’islam des pratiques étrangères à sa source. Il prônait un retour aux textes fondamentaux, dans une lecture adaptée à son époque. Sa pensée religieuse était critique, moderne, et en phase avec les défis sociaux et politiques de son temps.",
    "scholarName": "Moufdi Zakaria",
    "scholarId": 5,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Réforme religieuse",
    "imageArticle": {
      "url": image3
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Spiritualité dans la pensée de Moufdi Zakaria",
    "description": "La spiritualité était au cœur de la démarche de Moufdi Zakaria. Pour lui, la foi ne se limitait pas aux rituels, mais s’exprimait dans le comportement, la justice et le service de la communauté. Il insistait sur une religion vécue intérieurement, fondée sur la sincérité et l’exemplarité.",
    "scholarName": "Moufdi Zakaria",
    "scholarId": 5,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Spiritualité",
    "imageArticle": {
      "url": image3
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "La langue et la culture chez Moufdi Zakaria",
    "description": "La défense de la langue était pour Moufdi Zakaria un acte de résistance. Il la considérait comme un vecteur fondamental de la culture et de l’identité. En écrivant, enseignant et publiant, il s’opposa à la francisation et œuvra à la renaissance linguistique et culturelle de l’Algérie.",
    "scholarName": "Moufdi Zakaria",
    "scholarId": 5,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Linguistique",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'éthique dans la vie de Moufdi Zakaria",
    "description": "Moufdi Zakaria incarnait une éthique rigoureuse. Son intégrité, sa sincérité et son engagement faisaient de lui un modèle. Il refusa les compromissions, défendit les plus faibles et fit toujours passer l’intérêt général avant ses intérêts personnels. Sa vie fut un exemple de droiture morale.",
    "scholarName": "Moufdi Zakaria",
    "scholarId": 5,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Éthique",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'engagement de Si M'hamed Ben Rahal pour l'éducation",
    "description": "Si M'hamed Ben Rahal a consacré sa vie à la diffusion du savoir dans un contexte colonial difficile. À travers des écoles et des enseignements novateurs, il a permis l’éveil d’une génération prête à défendre son identité nationale. Son approche était centrée sur la pédagogie islamique moderne, conjuguant foi, science et ouverture au monde.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Éducation",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Si M'hamed Ben Rahal et la construction de l'identité algérienne",
    "description": "L’œuvre de Si M'hamed Ben Rahal s’inscrit dans la résistance intellectuelle à la domination coloniale. En mettant en avant l’histoire, la langue et la foi, il a restauré chez les Algériens la fierté d’être eux-mêmes. Son discours, profondément enraciné dans les valeurs nationales, a contribué à forger l’unité du peuple.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Identité nationale",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Réformes religieuses proposées par Si M'hamed Ben Rahal",
    "description": "Réformateur dans l’âme, Si M'hamed Ben Rahal souhaitait purifier l’islam des pratiques étrangères à sa source. Il prônait un retour aux textes fondamentaux, dans une lecture adaptée à son époque. Sa pensée religieuse était critique, moderne, et en phase avec les défis sociaux et politiques de son temps.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Réforme religieuse",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Spiritualité dans la pensée de Si M'hamed Ben Rahal",
    "description": "La spiritualité était au cœur de la démarche de Si M'hamed Ben Rahal. Pour lui, la foi ne se limitait pas aux rituels, mais s’exprimait dans le comportement, la justice et le service de la communauté. Il insistait sur une religion vécue intérieurement, fondée sur la sincérité et l’exemplarité.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Spiritualité",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "La langue et la culture chez Si M'hamed Ben Rahal",
    "description": "La défense de la langue était pour Si M'hamed Ben Rahal un acte de résistance. Il la considérait comme un vecteur fondamental de la culture et de l’identité. En écrivant, enseignant et publiant, il s’opposa à la francisation et œuvra à la renaissance linguistique et culturelle de l’Algérie.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Linguistique",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'éthique dans la vie de Si M'hamed Ben Rahal",
    "description": "Si M'hamed Ben Rahal incarnait une éthique rigoureuse. Son intégrité, sa sincérité et son engagement faisaient de lui un modèle. Il refusa les compromissions, défendit les plus faibles et fit toujours passer l’intérêt général avant ses intérêts personnels. Sa vie fut un exemple de droiture morale.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Éthique",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  }
];

function ArticleParSavant({ savantId }) {
    const filteredArticles = articles.filter(article => article.scholarId === savantId);
  return (
    <div className='mb-16 border-2 border-stone-800 rounded-lg px-4 py-8 space-y-16 '>
        <h1 className="text-center text-5xl text-stone-800 font-semibold">Articles sur Abdel-Hamid ibn Badis</h1>
        <div className="grid grid-cols-3 justify-center gap-4">
            {filteredArticles.map((article, index) => (
                <ArticleCard key={index} article ={article}  />
            ))}
        </div>
    </div>
  )
}

export default ArticleParSavant



