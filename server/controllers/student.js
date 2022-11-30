const { PrismaClient } = require("@prisma/client");
const { JsonWebTokenError } = require("jsonwebtoken");
const prisma = new PrismaClient();
const jwtVerification = require("../modules/jwt_verification");

module.exports = class Student {
  static async getAllStudent(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const students = await prisma.Etudiant.findMany({
        select: {
          no_etudiant: true,
          prenom: true,
          nom: true,
          TA_EtuStatut: {
            select: {
              statut_etudiant: true,
            },
          },
          TA_EtudiantGroupe: {
            select: {
              note_ponderee: true,
              pourcentage_note_cumulee: true,
            },
          },
          a_surveiller: true,
        },
        where: {
          etat: true,
        },
      });

      for (let index = 0; index < students.length; index++) {
        const commentaire = await prisma.commentaire.findMany({
          select: {
            id: true,
          },
          where: {
            no_etudiant: students[index].no_etudiant,
          },
        });

        students[index].commentary_quantity = commentaire.length;
      }
      res.status(200).json(students);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getStudentsBySession(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const session = req.params.session;

      const students = await prisma.Etudiant.findMany({
        select: {
          no_etudiant: true,
          prenom: true,
          nom: true,
          TA_EtuStatut: {
            select: {
              statut_etudiant: true,
            },
          },
          TA_EtudiantGroupe: {
            select: {
              note_ponderee: true,
              pourcentage_note_cumulee: true,
            },
          },
          a_surveiller: true,
        },
        where: {
          etat: true,
          session_actuelle: Number(session),
        },
      });

      for (let index = 0; index < students.length; index++) {
        const commentaire = await prisma.commentaire.findMany({
          select: {
            id: true,
          },
          where: {
            no_etudiant: students[index].no_etudiant,
          },
        });

        students[index].commentary_quantity = commentaire.length;
      }
      res.status(200).json(students);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getStudentFormInfo(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const no_etudiant = req.params.no_etudiant;

      // Get all necessary info for student form
      const student = await prisma.Etudiant.findUnique({
        where: {
          no_etudiant: Number(no_etudiant),
        },
        include: {
          TA_EtuStatut: {
            include: {
              statut_etudiant: true,
            },
          },
          TA_EtudiantGroupe: {
            include: {
              groupe: {
                include: {
                  cours: {
                    include: {
                      campus: true,
                    },
                  },
                  session: true,
                  Commentaire: {
                    where: {
                      no_etudiant: Number(no_etudiant),
                    },
                    orderBy: {
                      date_creation: "desc",
                    },
                    include: {
                      employe: true,
                      code_remarque: true,
                    },
                  },
                },
              },
              code_remarque_note_finale: true,
            },
          },
          FormulaireMath: {
            include: {
              TA_Math: {
                include: {
                  cours_math: true,
                },
              },
            },
          },
          TA_EtudiantPaysStatut: {
            include: {
              pays: true,
              statut: true,
            },
          },
        },
      });

      // Get semester comments for all semesters student has classes in
      const semester_comments = await prisma.commentaire.findMany({
        where: {
          no_etudiant: Number(no_etudiant),
          groupe: {
            no_groupe: 0,
          },
        },
        orderBy: {
          date_creation: "desc",
        },
        include: {
          groupe: true,
          employe: true,
          code_remarque: true,
        },
      });
      student.semester_comments = semester_comments;

      res.json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPreviousStudent(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const no_etudiant = req.params.no_etudiant;

      let prev = await prisma.Etudiant.findMany({
        take: 1,
        where: {
          no_etudiant: {
            lt: Number(no_etudiant),
          },
          etat: true,
        },
        include: {
          TA_EtudiantGroupe: {
            include: {
              groupe: {
                include: {
                  cours: {
                    include: {
                      campus: true,
                    },
                  },
                  session: true,
                  Commentaire: {
                    where: {
                      no_etudiant: Number(no_etudiant),
                    },
                    orderBy: {
                      date_creation: "desc",
                    },
                    include: {
                      employe: true,
                      code_remarque: true,
                    },
                  },
                },
              },
              code_remarque_note_finale: true,
            },
          },
        },
        orderBy: {
          no_etudiant: "desc",
        },
      });

      if (prev === undefined || prev.length == 0) {
        prev = await prisma.Etudiant.findMany({
          take: -1,
          include: {
            TA_EtudiantGroupe: {
              include: {
                groupe: {
                  include: {
                    cours: {
                      include: {
                        campus: true,
                      },
                    },
                    session: true,
                    Commentaire: {
                      where: {
                        no_etudiant: Number(no_etudiant),
                      },
                      orderBy: {
                        date_creation: "desc",
                      },
                      include: {
                        employe: true,
                        code_remarque: true,
                      },
                    },
                  },
                },
                code_remarque_note_finale: true,
              },
            },
          },
          where: {
            etat: true,
          }
        });
      }
      res.status(200).json(prev);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPreviousStudentBySessions(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const no_etudiant = req.params.no_etudiant;
      let sessions = req.body.sessions;
  
      sessions = sessions.split(",").map(Number);

      let findManyOrCondition = [];

      for (let i = 0; i < sessions.length; i++) {
        findManyOrCondition.push({ 
          session_actuelle: sessions[i], 
        });
      }

      let prev = await prisma.Etudiant.findMany({
        take: 1,
        where: {
          OR: findManyOrCondition,
          no_etudiant: {
            lt: Number(no_etudiant),
          },
          etat: true,
        },
        include: {
          TA_EtudiantGroupe: {
            include: {
              groupe: {
                include: {
                  cours: {
                    include: {
                      campus: true,
                    },
                  },
                  session: true,
                  Commentaire: {
                    where: {
                      no_etudiant: Number(no_etudiant),
                    },
                    orderBy: {
                      date_creation: "desc",
                    },
                    include: {
                      employe: true,
                      code_remarque: true,
                    },
                  },
                },
              },
              code_remarque_note_finale: true,
            },
          },
        },
        orderBy: {
          no_etudiant: "desc",
        },
      });

      if (prev === undefined || prev.length == 0) {
        prev = await prisma.Etudiant.findMany({
          take: -1,
          include: {
            TA_EtudiantGroupe: {
              include: {
                groupe: {
                  include: {
                    cours: {
                      include: {
                        campus: true,
                      },
                    },
                    session: true,
                    Commentaire: {
                      where: {
                        no_etudiant: Number(no_etudiant),
                      },
                      orderBy: {
                        date_creation: "desc",
                      },
                      include: {
                        employe: true,
                        code_remarque: true,
                      },
                    },
                  },
                },
                code_remarque_note_finale: true,
              },
            },
          },
          where: {
            etat: true,
          }
        });
      }
      res.status(200).json(prev);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getNextStudent(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const no_etudiant = req.params.no_etudiant;

      let next = await prisma.Etudiant.findMany({
        take: 1,
        where: {
          no_etudiant: {
            gt: Number(no_etudiant),
          },
          etat: true,
        },
        include: {
          TA_EtudiantGroupe: {
            include: {
              groupe: {
                include: {
                  cours: {
                    include: {
                      campus: true,
                    },
                  },
                  session: true,
                  Commentaire: {
                    where: {
                      no_etudiant: Number(no_etudiant),
                    },
                    orderBy: {
                      date_creation: "desc",
                    },
                    include: {
                      employe: true,
                      code_remarque: true,
                    },
                  },
                },
              },
              code_remarque_note_finale: true,
            },
          },
        },
        orderBy: {
          no_etudiant: "asc",
        },
      });

      if (next === undefined || next.length == 0) {
        next = await prisma.Etudiant.findMany({
          take: 1,
          include: {
            TA_EtudiantGroupe: {
              include: {
                groupe: {
                  include: {
                    cours: {
                      include: {
                        campus: true,
                      },
                    },
                    session: true,
                    Commentaire: {
                      where: {
                        no_etudiant: Number(no_etudiant),
                      },
                      orderBy: {
                        date_creation: "desc",
                      },
                      include: {
                        employe: true,
                        code_remarque: true,
                      },
                    },
                  },
                },
                code_remarque_note_finale: true,
              },
            },
          },
          where: {
            etat: true,
          }
        });
      }
      res.status(200).json(next);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getNextStudentBySessions(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const no_etudiant = req.params.no_etudiant;
      let sessions = req.body.sessions;
  
      sessions = sessions.split(",").map(Number);

      let findManyOrCondition = [];

      for (let i = 0; i < sessions.length; i++) {
        findManyOrCondition.push({ 
          session_actuelle: sessions[i], 
        });
      }

      let next = await prisma.Etudiant.findMany({
        take: 1,
        where: {
          OR: findManyOrCondition,
          no_etudiant: {
            gt: Number(no_etudiant),
          },
          etat: true,
        },
        include: {
          TA_EtudiantGroupe: {
            include: {
              groupe: {
                include: {
                  cours: {
                    include: {
                      campus: true,
                    },
                  },
                  session: true,
                  Commentaire: {
                    where: {
                      no_etudiant: Number(no_etudiant),
                    },
                    orderBy: {
                      date_creation: "desc",
                    },
                    include: {
                      employe: true,
                      code_remarque: true,
                    },
                  },
                },
              },
              code_remarque_note_finale: true,
            },
          },
        },
        orderBy: {
          no_etudiant: "asc",
        },
      });

      if (next === undefined || next.length == 0) {
        next = await prisma.Etudiant.findMany({
          take: 1,
          include: {
            TA_EtudiantGroupe: {
              include: {
                groupe: {
                  include: {
                    cours: {
                      include: {
                        campus: true,
                      },
                    },
                    session: true,
                    Commentaire: {
                      where: {
                        no_etudiant: Number(no_etudiant),
                      },
                      orderBy: {
                        date_creation: "desc",
                      },
                      include: {
                        employe: true,
                        code_remarque: true,
                      },
                    },
                  },
                },
                code_remarque_note_finale: true,
              },
            },
          },
          where: {
            etat: true,
          }
        });
      }
      res.status(200).json(next);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async flagStudent(req, res) {
    try {
      const no_etudiant = req.params.no_etudiant;
      const { flagged } = req.body;

      await prisma.Etudiant.update({
        where: {
          no_etudiant: Number(no_etudiant),
        },
        data: {
          a_surveiller: flagged,
        },
      });

      res.status(200).json({
        message: `État de surveillance de l'étudiant mis à jour avec succès! (${
          flagged ? "Activé" : "Désactivé"
        })`,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
