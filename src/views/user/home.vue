<template>
  <div>
    <v-toolbar collapse color="#2989E2" dark>
      <router-link to="/log">
        <v-btn text>دخول</v-btn>
      </router-link>
    </v-toolbar>
    <v-container class="grey lighten-5">
      <v-row align="start" justify="start">
        <v-col md="6" sm="6" xs="12" class="bg"></v-col>
        <v-col xl="6" lg="6" md="6" sm="6" xs="12" align="right" class="pt-10">
          <h1 class="mt-2 pt-2" style="color:#1976d2;">المكتبة الالكترونية</h1>
          <p class="mb-12 pb-12 mt-5">منصة الكترونية للبحث عن الكتب وتحميلها</p>
          <v-row>
            <v-col xl="8" lg="8" md="8" sm="8" xs="12">
              <v-text-field
                label="اكتب للبحث"
                outlined
                rounded
                append-icon="mdi-magnify"
                v-model="search"
              ></v-text-field>
            </v-col>
            <v-col xl="4" lg="4" md="4" sm="4" xs="12">
              <v-select
                :items="items"
                label="اختر الصنف"
                outlined
                rounded
                v-model="sectionID"
                @input="getBooks()"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="mx-4 mb-12"></v-divider>
      <v-row v-if="!loading">
        <v-col
          v-for="card in filteredList"
          :key="card.code"
          xl="4"
          lg="4"
          md="6"
          sm="6"
          xs="12"
          :search="search"
        >
          <v-card class="mx-auto" max-width="374">
            <v-img height="250" :src="'http://88.80.148.60:4421/'+card.photos[0]"></v-img>

            <v-card-title v-text="card.name"></v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0">
                <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>

                <div class="grey--text ml-4">4.5 (413)</div>
              </v-row>

              <v-chip class="ma-2" color="orange " outlined>
                <v-avatar left>
                  <v-icon>mdi-tag-text</v-icon>
                </v-avatar>
                {{card.sectionName}}
              </v-chip>
              <v-chip class="ma-2" color="deep-purple darken-1" text-color="white">
                <v-avatar left>
                  <v-icon>mdi-account-circle</v-icon>
                </v-avatar>
                {{card.authorName}}
              </v-chip>
              <v-chip class="ma-2" color="green" text-color="white">
                رقم الرف :
                <v-avatar right class="green darken-4">{{card.shelfNumber}}</v-avatar>
              </v-chip>
              <v-chip class="ma-2" color="success" outlined>
                <v-icon left>mdi-printer</v-icon>
                {{card.namePrinting}}
              </v-chip>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-actions>
              <router-link :to="{ name: 'booking', params: { id: card.id } }">
                <v-btn color="deep-purple lighten-2" text @click="showBook(card.id)">معاينة</v-btn>
              </router-link>
              <v-btn color="green accent-4" text @click="downloadBook(card.path)">تحميل</v-btn>

              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="loading">
        <v-col>
          <v-skeleton-loader :loading="loading" :transition="transition" type="card"></v-skeleton-loader>
        </v-col>
        <v-col>
          <v-skeleton-loader :loading="loading" :transition="transition" type="card"></v-skeleton-loader>
        </v-col>
        <v-col>
          <v-skeleton-loader :loading="loading" :transition="transition" type="card"></v-skeleton-loader>
        </v-col>
      </v-row>

      <v-row class="text-center py-5">
        <v-pagination v-model="page" :length="1" circle></v-pagination>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      sectionID: "",
      search: "",
      page: 1,
      items: [],
      cards: [],
      show: false,
      transition: "scale-transition",
      loading: false
    };
  },
  computed: {
    filteredList() {
      return this.cards.filter(post => {
        return (
          post.name.toLowerCase().includes(this.search.toLowerCase()) ||
          post.namePrinting.toLowerCase().includes(this.search.toLowerCase()) ||
          // post.shelfNumber.toLowerCase().includes(this.search.toLowerCase()) ||
          post.authorName.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    }
  },
  methods: {
    getBooks() {
      this.loading = true;
      axios
        .get("book/show?SectionId=" + this.sectionID)
        .then(res => {
          this.loading = false;
          this.cards = res.data.result.book;
          for (const val of this.cards) {
            val.date2 = val.date.substr(0, 10);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getlab() {
      axios
        .get("section/show")
        .then(res => {
          this.items = res.data.result.section;
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].value = this.items[i].id;
            this.items[i].text = this.items[i].name;
          }
          this.items.push({
            value: "",
            text: "الكل"
          });
        })
        .catch(err => {});
    },
    onSend() {},
    validate() {
      this.$refs.form.validate();
      this.onSend();
    },
    reset() {
      this.$refs.form.reset();
    },
    showBook(id) {
      console.log(id);
    },
    downloadBook(id) {
      window.open(process.env.VUE_APP_URL + "book/download?filepath=" + id);
    }
  },
  created() {
    this.getBooks();
    this.getlab();
  }
};
</script>

<style lang="scss" scoped>
.bg {
  background-image: url("../../assets/home.svg");
  background-repeat: no-repeat;
  // background-origin: content-box, padding-box;
  // background-attachment: absolute;
  background-position: top left;
  background-size: 100%;
  // height: 100vh;
  top: 0;
  left: 0;
  bottom: 0;
  position: absolute;
}
p {
  color: rgb(80, 80, 80);
  font-size: 1.2rem;
  font-family: "Cairo", sans-serif;
}
h1 {
  font-size: 3rem;
  font-family: "Cairo", sans-serif;
}
@media only screen and (max-width: 600px) {
  .bg {
    background-size: 80%;
  }
}
</style>
