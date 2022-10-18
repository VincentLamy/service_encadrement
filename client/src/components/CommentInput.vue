<template>
  <v-card v-if="show" class="mb-5" style="width: 100%;" outlined>
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="8">
            <v-text-field
              class="mb-3"
              label="Titre"
              v-model="comment.title.value"
              :rules="comment.title.rules"
              counter="64"
              outlined
              required
            />
            <v-textarea
              label="Description"
              v-model="comment.description.value"
              :rules="comment.description.rules"
              counter="255"
              no-resize
              outlined
              required
            />
          </v-col>
          <v-col cols="4">
            <v-select
              class="mb-3"
              label="Remarque"
              :items="remarkCodes"
              item-value="code"
              item-text="nom"
              v-model="comment.remark_id.value"
              :rules="comment.remark_id.rules"
              outlined
              required
            />
            <v-btn class="mb-3" x-large block @click="cancelComment">
              Annuler
            </v-btn>
            <v-btn v-if="method === 'publish'" color="primary" x-large block @click="addComment">
              Publier
            </v-btn>
            <v-btn v-if="method === 'edit'" color="primary" x-large block @click="editComment">
              Modifier
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import API from "@/api";

export default {
  name: "v-comment-input",
  props: {
    show: {
      type: Boolean,
    },
    method: {
      type: String,
    },
    noEtudiant: {
      type: Number,
    },
    remarkCodes: {
      type: Array,
    },
    idEditedComment: {
      type: Number,
    },
  },
  data() {
    return {
      comment: {
        title: {
          value: "",
          rules: [
            (v) => !!v || "Un titre est requis",
            (v) =>
              v.length <= 64 || "Le titre doit contenir moins de 64 caractères",
          ],
        },
        description: {
          value: "",
          rules: [
            (v) => !!v || "Une description est requise",
            (v) =>
              v.length <= 255 ||
              "La description doit contenir moins de 255 caractères",
          ],
        },
        remark_id: {
          value: null,
          rules: [(v) => !!v || "Un code de remarque doit être choisi"],
        },
      },
    };
  },
  methods: {
    async addComment() {
      await API.addComment({
        no_etudiant: this.noEtudiant,
        no_employe: 6, // TODO - Mettre le no_employe de l'utilisateur
        id_groupe: 4, // TODO - Mettre l'id_groupe à null, marche pas pour le moment
        id_code_remarque: this.comment.remark_id.value,
        titre: this.comment.title.value,
        contenu: this.comment.description.value,
      });
    },
    async editComment() {
      await API.editComment({
        id: this.idEditedComment,
        titre: this.comment.title.value,
        contenu: this.comment.description.value,
        id_code_remarque: this.comment.remark_id.value,
      })
    },
    async cancelComment() {
      this.show_add_comment = false;
      this.comment.title.value = null;
      this.comment.description.value = null;
      this.comment.remark_id.value = null;
    },
  },
};
</script>
