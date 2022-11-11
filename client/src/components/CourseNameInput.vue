<template>
  <!-- Modifier le nom du cours -->
  <v-menu
    v-model="show_form"
    :close-on-content-click="false"
    @input="onCourseMenuToggle"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        x-small
        outlined
        color="blue darken-3"
        class="mb-1"
        :loading="loading"
        v-bind="attrs"
        v-on="on"
      >
        {{ data.nom || "Ajouter un nom au cours" }}
      </v-btn>
    </template>
    <template>
      <v-card :loading="loading">
        <v-card-title> Modifier le nom du cours </v-card-title>
        <v-card-text>
          <v-form
            ref="courseNameForm"
            onSubmit="return false;"
            @keyup.native.enter="updateCourseName()"
          >
            <v-text-field
              label="Nom du cours"
              outlined
              v-model="course_input.value"
              counter="64"
              :rules="course_input.rules"
              :append-outer-icon="'mdi-arrow-right'"
              @click:append-outer="updateCourseName()"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-menu>
</template>

<script>
import API from "@/api";

export default {
  name: "v-course-name-input",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      show_form: false,
      course_input: {
        value: "",
        rules: [
          (v) => !!v || "Un nom de cours est requis",
          (v) =>
            v.length <= 64 ||
            "Le nom du cours doit contenir moins de 64 caractères",
        ],
      },
      loading: false,
    };
  },
  methods: {
    async updateCourseName() {
      if (!this.$refs.courseNameForm.validate()) return;

      this.loading = true;

      await API.changeCourseName({
        code: this.data.code,
        name: this.course_input.value,
      });

      this.loading = false;
      this.show_form = false;
      this.$emit("updated");
    },
    async onCourseMenuToggle(opened) {
      if (!opened) this.course_input.value = "";
    },
  },
};
</script>
