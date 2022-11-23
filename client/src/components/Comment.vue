<template>
    <v-list-item class="py-3">
        <v-row class="align-center">
        <v-list-item-content>
            <v-list-item-title class="black--text text-wrap">{{ data.titre }}</v-list-item-title>           <!-- Titre du commentaire -->
            <v-list-item-subtitle class="text-wrap">{{ data.contenu }}</v-list-item-subtitle>               <!-- Description du commentaire -->
        </v-list-item-content>

        <v-list-item-action class="d-flex flex-column justify-space-between">
            <v-list-item-action-text>
                <div class="d-flex justify-end">
                    <v-chip class="ms-1 font-weight-bold" x-small>{{ data.code_remarque.nom }}</v-chip>     <!-- Code de la remarque -->
                </div>
                <p class="ma-0 black--text text-end">
                    {{ data.employe.nom }}, {{ data.employe.prenom }}                                       <!-- Nom de l'enseignant qui a écrit le commentaire -->
                    <span class="ms-4 grey--text">{{ dateToString(data.date_creation) }}</span>             <!-- Date de création du commentaire -->
                </p>
            </v-list-item-action-text>
        </v-list-item-action>

        
        <v-btn v-if="editable" class="ms-2" text icon @click="edit">                                        <!-- Boutons de modification -->
            <v-icon>mdi-pencil-outline</v-icon>                                                             <!-- Icône du bouton -->
        </v-btn>

        <!-- Formulaire de modification du commentaire -->
        <v-comment-input
            :show="editing"
            :remark-codes="remarkCodes"
            :id-edited-comment="data.id"
            :base-comment="data"
            method="edit"
            @updated="updateData"
            @cancel="editing = false"
        /></v-row>
    </v-list-item>
</template>

<script>
    import CommentInput from "@/components/CommentInput";

    export default {
        name: "v-comment",
        props: {
            data:           { type: Object },
            editable:       { type: Boolean },
            remarkCodes:    { type: Array },
        },
        data() {
            return { editing: false };
        },
        methods: {
            dateToString(d) {
                d = new Date(d);
                const options = {
                    year:   "numeric",
                    month:  "short",
                    day:    "numeric",
                    hour:   "numeric",
                    minute: "numeric",
                };

                return d.toLocaleDateString("fr-CA", options);
            },
            edit() {
                this.editing = !this.editing;
            },
            updateData() {
                this.$emit("updated");
            },
        },
        components: {
            "v-comment-input": CommentInput,
        },
    };
</script>