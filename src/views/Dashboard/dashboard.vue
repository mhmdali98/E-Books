<template>
  <v-container>
    <v-toolbar dense flat color="grey lighten-4">
      <v-toolbar-title class="pl-2">الرئيسية</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-row class>
      <v-col cols="12" md="4" sm="12">
        <v-skeleton-loader :loading="loading" :transition="transition" type="card">
          <v-card class="mt-4 mx-auto" max-width="400">
            <v-sheet
              class="v-sheet--offset mx-auto"
              color="indigo darken-1"
              elevation="12"
              max-width="calc(100% - 32px)"
            >
              <v-sparkline
                :labels="labels"
                :value="value"
                color="white"
                line-width="2"
                padding="16"
              ></v-sparkline>
            </v-sheet>

            <v-card-text class="pt-0">
              <div class="title font-weight-light mb-2">12</div>
              <div class="subheading font-weight-light grey--text">عدد المستخدمين</div>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <v-skeleton-loader :loading="loading" :transition="transition" type="card">
          <v-card class="mt-4 mx-auto" max-width="400">
            <v-sheet
              class="v-sheet--offset mx-auto"
              color="teal darken-1"
              elevation="12"
              max-width="calc(100% - 32px)"
            >
              <v-sparkline
                :labels="labels"
                :value="value"
                color="white"
                line-width="2"
                padding="16"
              ></v-sparkline>
            </v-sheet>

            <v-card-text class="pt-0">
              <div class="title font-weight-light mb-2">234</div>
              <div class="subheading font-weight-light grey--text">عدد الكتب</div>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <v-skeleton-loader :loading="loading" :transition="transition" type="card">
          <v-card class="mt-4 mx-auto" max-width="400">
            <v-sheet
              class="v-sheet--offset mx-auto"
              color="purple darken-1"
              elevation="12"
              max-width="calc(100% - 32px)"
            >
              <v-sparkline
                :labels="labels"
                :value="value"
                color="white"
                line-width="2"
                padding="16"
              ></v-sparkline>
            </v-sheet>

            <v-card-text class="pt-0">
              <div class="title font-weight-light mb-2">43220</div>
              <div class="subheading font-weight-light grey--text">عدد التنزيلات</div>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row class="mb-6">
      <v-col cols="12" lg="6" md="6" sm="12">
        <v-skeleton-loader :loading="loading" :transition="transition" type="card">
          <v-card class="pt-10" color="grey lighten-4" elevation="5">
            <ve-pie :data="chartData"></ve-pie>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col lg="6" md="6" sm="12">
        <v-skeleton-loader :loading="loading" :transition="transition" type="card">
          <v-card class="pt-10" color="grey lighten-4" elevation="5">
            <ve-line :data="chartData2"></ve-line>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
const exhale = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  data: () => ({
    labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
    value: [200, 675, 410, 390, 310, 460, 250, 240],
    dash: [],
    transition: "scale-transition",
    loading: false,
    checking: false,
    heartbeats: [],
    heartbeats2: [],
    heartbeats3: [],
    fill: true,
    chartData2: {
      columns: ["date", "التحميلات", "التنزيلات"],
      rows: [
        {
          التحميلات: 1,
          date: "05/05",
          التنزيلات: 1
        },
        {
          التحميلات: 3,
          date: "05/10",
          التنزيلات: 2
        },
        {
          التحميلات: 5,
          date: "05/15",
          التنزيلات: 6
        },
        {
          التحميلات: 2,
          date: "05/20",
          التنزيلات: 4
        },
        {
          التحميلات: 4,
          date: "05/25",
          التنزيلات: 5
        },
        {
          التحميلات: 6,
          date: "05/30",
          التنزيلات: 2
        }
      ]
    },
    chartData: {
      columns: ["name", "number"],
      rows: [
        { name: "الرياضة", number: 14 },
        { name: "الهندسة", number: 45 },
        { name: "الطب", number: 37 },
        { name: "البرمجة", number: 55 },
        { name: "السياسة", number: 22 },
        { name: "الطبخ", number: 10 },
        { name: "العلوم", number: 32 }
      ]
    }
    // colors1: ["#2d3368", "#303F9F", "#61a0a8", "#d48265"]
  }),

  computed: {
    avg() {
      const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0);
      const length = this.heartbeats.length;

      if (!sum && !length) return 0;

      return Math.ceil(sum / length);
    }
  },

  created() {
    this.takePulse(false);
    this.getDash();
  },

  methods: {
    getDash() {
      this.loading = true;
      axios
        .get("Lab/Dashboard")
        .then(res => {
          this.dash = res.data.result;
          this.chartData.rows[0].number = this.dash.done;
          this.chartData.rows[1].number = this.dash.notdone;

          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    heartbeat() {
      return Math.ceil(Math.random() * (120 - 80) + 80);
    },
    async takePulse(inhale = true) {
      this.checking = true;

      inhale && (await exhale(1000));

      this.heartbeats = Array.from({ length: 20 }, this.heartbeat);
      this.heartbeats2 = Array.from({ length: 15 }, this.heartbeat);
      this.heartbeats3 = Array.from({ length: 10 }, this.heartbeat);

      this.checking = false;
    }
  }
};
</script>

<style lang="scss" scoped>
strong {
  font-size: 1rem;
}
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
