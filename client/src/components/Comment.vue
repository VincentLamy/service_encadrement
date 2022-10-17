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
            <v-chip class="ms-1 font-weight-bold" x-small> {{ data.code_remarque.nom }} </v-chip>
          </div>
          <p class="ma-0 black--text">
            {{ data.employe.nom }},
            {{ data.employe.prenom }}
            <span class="ms-4 grey--text">
              {{ dateToString(data.date_creation) }}
            </span>
          </p>
        </v-list-item-action-text>
      </v-list-item-action>

      <!-- Boutons de modification -->
      <v-btn v-if="editable" class="ms-2" text icon>
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </v-row>
  </v-list-item>
</template>

<script>
export default {
  name: "v-comment",
  props: {
    data: {
      type: Object,
    },
    editable: {
      type: Boolean,
    },
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
  },
};
</script>
