<template>
  <v-container>
    <h2 class="my-2 d-flex justify-center" style="flex-grow: 1">
      Liste des cours
    </h2>

    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Rechercher"
    ></v-text-field>
    <v-data-table :headers="headers" :items="courses" :search="search">
      <template v-slot:item.nom="{ item }">
        <v-course-name-input :data="item" @updated="getData" />
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import API from "../api";
import CourseNameInput from "@/components/CourseNameInput";

export default {
  name: "course_list",
  data() {
    return {
      headers: [
        { text: "Code", value: "code" },
        { text: "Nom", value: "nom" },
        { text: "Campus", value: "campus.ville" },
        { text: "Durée (h)", value: "duree" },
      ],
      courses: [],
      search: "",
    };
  },
  async created() {
    await this.getData();
  },
  methods: {
    async getData() {
      this.courses = await API.getAllCourse();
    },
  },
  components: {
    "v-course-name-input": CourseNameInput,
  },
};
</script>
