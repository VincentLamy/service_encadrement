<template>
  <v-card v-if="show" class="mb-5" style="width: 100%" outlined>
    <v-card-text>
      <v-alert v-model="success" dense text type="success" dismissible>
        Le commentaire a été
        <strong>
          {{ method === "publish" ? "publié" : "modifié" }}
        </strong>
        avec succès!
      </v-alert>
      <v-progress-linear
        v-if="loading"
        indeterminate
        class="mb-4"
      ></v-progress-linear>
      <v-form ref="commentForm">
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
            <v-btn
              v-if="method === 'publish'"
              color="primary"
              x-large
              block
              @click="addComment"
            >
              Publier
            </v-btn>
            <v-btn
              v-if="method === 'edit'"
              color="primary"
              x-large
              block
              @click="editComment"
            >
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
    codeSession: {
      type: String,
    },
    remarkCodes: {
      type: Array,
    },
    idEditedComment: {
      type: Number,
    },
    baseComment: {
      type: Object,
      default: () => ({
        titre: "",
        contenu: "",
        id_code_remarque: 0,
      }),
    },
  },
  data() {
    return {
      loading: false,
      success: false,
      comment: {
        title: {
          value: this.baseComment.titre,
          rules: [
            (v) => !!v || "Un titre est requis",
            (v) =>
              v.length <= 64 || "Le titre doit contenir moins de 64 caractères",
          ],
        },
        description: {
          value: this.baseComment.contenu,
          rules: [
            (v) => !!v || "Une description est requise",
            (v) =>
              v.length <= 255 ||
              "La description doit contenir moins de 255 caractères",
          ],
        },
        remark_id: {
          value: this.baseComment.id_code_remarque,
          rules: [(v) => !!v || "Un code de remarque doit être choisi"],
        },
      },
    };
  },
  methods: {
    async addComment() {
      // Cancel if form isn't valid
      if (!this.$refs.commentForm.validate()) return;

      this.loading = true;
      await API.addComment({
        no_etudiant: this.noEtudiant,
        no_employe: 6, // TODO - Mettre le no_employe de l'utilisateur
        code_session: this.codeSession,
        id_code_remarque: this.comment.remark_id.value,
        titre: this.comment.title.value,
        contenu: this.comment.description.value,
      });
      this.$emit("published");
      this.loading = false;
      this.success = true;
    },
    async editComment() {
      // Cancel if form isn't valid
      if (!this.$refs.commentForm.validate()) return;

      this.loading = true;
      await API.editComment({
        id: this.idEditedComment,
        titre: this.comment.title.value,
        contenu: this.comment.description.value,
        id_code_remarque: this.comment.remark_id.value,
      });
      this.$emit("updated");
      this.loading = false;
      this.success = true;
    },
    async cancelComment() {
      this.$emit("cancel");
      this.comment.title.value =
        this.method === "publish" ? "" : this.baseComment.titre;
      this.comment.description.value =
        this.method === "publish" ? "" : this.baseComment.contenu;
      this.comment.remark_id.value =
        this.method === "publish" ? "" : this.baseComment.id_code_remarque;
    },
  },
};
</script>
