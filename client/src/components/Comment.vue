<template>
  <v-list-item class="py-3">
    <v-row class="align-center">
      <!-- Titre + commentaire -->
      <v-list-item-content>
        <v-list-item-title>
          <span class="black--text"> {{ data.titre }} </span>
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ data.contenu }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <!-- Catégories du commentaire + date de publication -->
      <v-list-item-action class="d-flex flex-column justify-space-between">
        <v-list-item-action-text>
          <div class="d-flex justify-end">
            <v-chip class="ms-1 font-weight-bold" x-small>
              {{ data.code_remarque.nom }}
            </v-chip>
          </div>
          <p class="ma-0 black--text text-end">
            {{ data.employe.nom }},
            {{ data.employe.prenom }}
            <span class="ms-4 grey--text">
              {{ dateToString(data.date_creation) }}
            </span>
          </p>
        </v-list-item-action-text>
      </v-list-item-action>

      <!-- Boutons de modification -->
      <v-btn v-if="editable" class="ms-2" text icon @click="edit">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>

      <!-- Formulaire de modification du commentaire -->
      <v-comment-input
        :show="editing"
        :remark-codes="remarkCodes"
        method="edit"
        :id-edited-comment="data.id"
        @updated="updateData"
      />
    </v-row>
  </v-list-item>
</template>

<script>
import CommentInput from "@/components/CommentInput";

export default {
  name: "v-comment",
  props: {
    data: {
      type: Object,
    },
    editable: {
      type: Boolean,
    },
    remarkCodes: {
      type: Array,
    },
  },
  data() {
    return {
      editing: false,
    };
  },
  methods: {
    dateToString(d) {
      d = new Date(d);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return d.toLocaleDateString("fr-CA", options);
    },
    edit() {
      this.editing = !this.editing;
    },
    updateData() {
      console.log("caught event, emitting from Comment");
      this.$emit("updated");
    },
  },
  components: {
    "v-comment-input": CommentInput,
  },
};
</script>
