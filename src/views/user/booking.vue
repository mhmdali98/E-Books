<template>
  <v-container class="grey lighten-5">
    <v-btn color="primary" dark @click="back()">رجوع</v-btn>

    <v-row v-if="!loading">
      <v-col xl="12" lg="12" md="12" sm="12" xs="12">
        <v-card class="mx-auto">
          <v-img height="250" :src="'http://88.80.148.60:4421/'+card.photos[0]"></v-img>

          <v-card-title v-text=" 'اسم الكتاب : '+card.name "></v-card-title>

          <v-card-text>
            <v-row align="center" class="mx-0">
              <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>
              <div class="grey--text ml-4">4.5 (413)</div>
            </v-row>

            <v-chip class="ma-2" color="orange " outlined>
              <v-avatar left>
                <v-icon>mdi-tag-text</v-icon>
              </v-avatar>
              الصنف :
              {{card.sectionName}}
            </v-chip>
            <v-chip class="ma-2" color="deep-purple darken-1" text-color="white">
              <v-avatar left>
                <v-icon>mdi-account-circle</v-icon>
              </v-avatar>
              اسم الكاتب :
              {{card.authorName}}
            </v-chip>
            <v-chip class="ma-2" color="success" outlined>
              <v-icon left>mdi-printer</v-icon>
              اسم المطبعة : {{card.namePrinting}}
            </v-chip>
            <v-chip class="ma-2" color="green" text-color="white">
              رقم الرف :
              <v-avatar right class="green darken-4">{{card.shelfNumber}}</v-avatar>
            </v-chip>
            <v-chip class="ma-2" color="blue-grey darken-1" label text-color="white">
              <v-icon left>mdi-calendar-range</v-icon>
              تاريخ الطباعة : {{card.date2}}
            </v-chip>
          </v-card-text>
          <v-alert
            class="ma-5"
            text
            dense
            color="teal"
            icon="mdi-clock-fast"
            border="left"
          >عن الكتاب : {{card.note}}</v-alert>

          <v-divider class="mx-4"></v-divider>

          <v-card-actions>
            <v-btn color="green accent-4" dark block @click="downloadBook(card.path)">تحميل الكتاب</v-btn>

            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  props: ["id"],
  data() {
    return {
      card: [],
      loading: false
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    downloadBook(id) {
      window.open(process.env.VUE_APP_URL + "book/download?filepath=" + id);
    },
    getBooks() {
      this.loading = true;
      axios
        .get("book/showbybook?Id=" + this.id)
        .then(res => {
          this.loading = false;
          this.card = res.data.result.book;
          this.card.date2 = this.card.date.substr(0, 10);
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getBooks();
  }
};
</script>

<style>
.v-progress-circular {
  margin: 1rem;
}
</style>