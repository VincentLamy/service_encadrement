<template>
  <v-expansion-panels accordion flat>
    <v-course
      v-for="student_group in data"
      :key="student_group.id"
      :data="student_group"
      :remark-codes="remarkCodes"
      @update-data="updateData"
    />
  </v-expansion-panels>
</template>

<script>
import Course from "@/components/Course";

export default {
  name: "v-course-list",
  props: {
    data: {
      type: Array,
    },
    remarkCodes: {
      type: Array,
    },
  },
  methods: {
    updateData() {
      this.$emit("update-data");
    },
  },
  components: {
    "v-course": Course,
  },
};
</script>
