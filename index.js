const fs = require("node:fs");

fs.readFile("./data/students.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    process.exit(0);
  }

  let studentArr = [];

  try {
    studentArr = JSON.parse(fs.readFileSync("./data/students.txt", "utf8"));
  } catch (parseError) {
    console.error("Erreur de parsing des données:", parseError);
    process.exit(0);
  }

  const displayMenu = () => {
    console.log("--------------------");
    console.log("Bienvenue dans l'application de gestion des étudiants");
    console.log("--------------------");
    console.log("Pressez sur 'M' pour retourner au menu");
    console.log("Pressez sur 'L' pour lister les étudiants");
    console.log("Pressez sur 'R' pour rechercher un étudiant par son nom");
    console.log("Pressez sur 'F' pour filtrer les étudiants par moyenne");
    console.log("Pressez sur 'Q' pour quitter l'application");
    console.log("Non sensible à la casse");
  };

  //Afficher menu
  process.stdin.on("data", (data) => {
    if (data.toString().trim().toLowerCase() === "m") {
      //clear console
      console.clear();
      displayMenu();
    }
  });

  displayMenu();

  //Check des lettres pressées différentes de M, L, R, F, Q
  process.stdin.on("data", (data) => {
    if (
      data.toString().trim().toUpperCase() !== "M" ||
      data.toString().trim().toUpperCase() !== "L" ||
      data.toString().trim().toUpperCase() !== "R" ||
      data.toString().trim().toUpperCase() !== "F" ||
      data.toString().trim().toUpperCase() !== "Q"
    ) {
      console.log("--------------------");
      console.log("Commande inconnue. Veuillez réessayer.");
      console.log("--------------------");
      console.log("Pressez sur 'M' pour retourner au menu");
    }
  });

  //Fonction quitter app
  const quitApp = () => {
    console.log("Merci d'avoir utilisé l'application. À bientôt...!");
    process.exit(0);
  };

  //Quit app
  process.stdin.on("data", (data) => {
    if (data.toString().trim().toLowerCase() === "q") {
      quitApp();
    }
  });

  //Lister les etudiants en appuyant sur la touche L
  process.stdin.on("data", (data) => {
    if (data.toString().trim().toLowerCase() === "l") {
      //clear console
      console.clear();
      console.log("--------------------");
      console.log("Liste des étudiants:");
      studentArr.map((student) => {
        console.log(`- ${student.name}`);
      });
      console.log("--------------------");
      console.log("Pressez sur 'M' pour retourner au menu");
    }
  });

  //Proposer la recherche si R est pressé puis fonction recherche par Nom
  process.stdin.on("data", (data) => {
    if (data.toString().trim().toLowerCase() === "r") {
      console.clear();
      console.log("--------------------");
      console.log("Recherche d'un étudiant:");
      console.log("--------------------");
      console.log("Entrez le nom de l'étudiant:");
      process.stdin.once("data", (data) => {
        const studentName = data.toString().trim();
        const student = studentArr.find(
          (s) => s.name.toLowerCase() === studentName.toLowerCase()
        );
        if (student) {
          console.clear();
          console.log("--------------------");
          console.log(`Détails de l'étudiant ${student.name}:`);
          console.log(`- Notes: ${student.notes}`);
          console.log(`- Adresse: ${student.address}`);
          console.log("--------------------");
          console.log("Pressez sur 'M' pour retourner au menu");
        } else {
          console.log(`Aucun étudiant trouvé avec le nom "${studentName}".`);
        }
      });
    }
  });

  //Fonctionnalité pour filtrer et afficher les élèves ayant obtenu une moyenne supérieure à une valeur spécifiée
  const filterStudentsBymoyenne = (minMoyenne) => {
    const filteredStudents = studentArr.filter((student) => {
      const moyenne =
        student.notes.reduce((a, b) => a + b, 0) / student.notes.length;
      return moyenne > minMoyenne;
    });

    console.clear();
    if (filteredStudents.length > 0) {
      console.log(`Étudiants ayant une moyenne supérieure à ${minMoyenne}:`);
      filteredStudents.forEach((student) => {
        console.log(
          `- ${student.name} (Moyenne: ${
            student.notes.reduce((a, b) => a + b, 0) / student.notes.length
          })`
        );
      });
    } else {
      console.log(
        `Aucun étudiant trouvé avec une moyenne supérieure à ${minMoyenne}.`
      );
    }
    console.log("--------------------");
    console.log("Pressez sur 'M' pour retourner au menu");
  };

  //Si F pressé, proposé filtrage par moyenne
  process.stdin.on("data", (data) => {
    if (data.toString().trim().toLowerCase() === "f") {
      console.clear();
      console.log("--------------------");
      console.log("Filtrer les étudiants par moyenne:");
      console.log("--------------------");
      console.log("Entrez la moyenne minimale:");
      process.stdin.once("data", (data) => {
        const minMoyenne = parseFloat(data.toString().trim());
        if (!isNaN(minMoyenne)) {
          filterStudentsBymoyenne(minMoyenne);
        } else {
          console.log("Veuillez entrer une valeur numérique valide.");
        }
      });
    }
  });
});
