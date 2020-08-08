<template>
  <div>
    <v-toolbar dense flat color="grey lighten-4">
      <v-toolbar-title class="pl-2">الكتب</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="detailsDialog = true">اضافة كتاب</v-btn>
    </v-toolbar>
    <v-container class="grey lighten-5">
      <v-row class="mx-1">
        <v-text-field
          v-model="search"
          outlined
          dense
          hide-details
          filled
          prepend-inner-icon="search"
          placeholder="اكتب للبحث"
        />
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-data-table
            :loading="loading"
            loading-text="جاري جلب المعلومات"
            class="mt-4"
            :headers="headers"
            :items="items"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            :search="search"
          >
            <template v-slot:item.isDeleted="{ item }">
              <v-chip
                class="ma-2"
                color="green"
                text-color="white"
                v-if="!item.isDeleted"
              >{{ item.isDeleted }}</v-chip>
              <v-chip
                class="ma-2"
                color="orange"
                text-color="white"
                v-if="item.isDeleted"
              >{{ item.isDeleted }}</v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom v-if="!item.isDeleted">
                <template v-slot:activator="{ on }">
                  <v-btn class="indigo--text" icon v-on="on" large>
                    <v-icon l @click="delet(item.id)" color="red">mdi-delete-outline</v-icon>
                  </v-btn>
                </template>
                <span>الغاء تفعيل</span>
              </v-tooltip>
              <v-tooltip bottom v-if="item.isDeleted">
                <template v-slot:activator="{ on }">
                  <v-btn class="indigo--text" icon v-on="on" large>
                    <v-icon l @click="delet(item.id)" color="warning">mdi-backup-restore</v-icon>
                  </v-btn>
                </template>
                <span>تفعيل</span>
              </v-tooltip>
              <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn class="indigo--text" icon v-on="on" large>
                    <v-icon l @click="edit(item.id)" color="green">mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
                <span>تعديل</span>
              </v-tooltip>-->
            </template>
            <template v-slot:no-data>
              <h3>لاتوجد بيانات لعرضها</h3>
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="detailsDialog" width="400" persistent>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>
            <h3>اضافة كتاب</h3>
          </v-toolbar-title>
          <v-spacer />
          <v-btn @click="detailsDialog = false" icon>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <br />
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field outlined label="الاسم الكتاب : " v-model="nameBook" />
              <v-select
                :items="labOption"
                label="اختر الصنف"
                outlined
                :rules="[(v) => !!v || 'يجب تحديد الصنف']"
                required
                v-model="roleId"
              ></v-select>
              <v-text-field outlined label="كود الكتاب : " v-model="bookCode" />
              <v-text-field outlined label="رقم الرف : " v-model="bookNum" />
              <v-text-field outlined label="اسم الكاتب : " v-model="katib" />
              <v-text-field outlined label="اسم المطبعة : " v-model="mtba3a" />
              <v-textarea outlined name="input-7-4" label="نبذه عن الكتاب" v-model="descrb"></v-textarea>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    v-model="date"
                    label="تاريخ الطباعة"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="red" @click="menu = false">اغلاق</v-btn>
                  <v-btn text color="blue" @click="$refs.menu.save(date)">حفظ</v-btn>
                </v-date-picker>
              </v-menu>
              <v-file-input
                v-model="file"
                counter
                label="اختر صورة الكتاب"
                outlined
                :show-size="1000"
              >
                <template v-slot:selection="{ index, text }">
                  <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>{{ text }}</v-chip>

                  <span
                    v-else-if="index === 2"
                    class="overline grey--text text--darken-3 mx-2"
                  >+{{ files.length - 2 }} File</span>
                </template>
              </v-file-input>
              <v-file-input
                v-model="bookFile"
                counter
                label="اختر ملف الكتاب"
                outlined
                :show-size="1000"
              >
                <template v-slot:selection="{ index, text }">
                  <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>{{ text }}</v-chip>

                  <span
                    v-else-if="index === 2"
                    class="overline grey--text text--darken-3 mx-2"
                  >+{{ files.length - 2 }} File(s)</span>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
          <br />
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="detailsDialog = false">اغلاق</v-btn>
          <v-btn color="blue darken-1" text @click="uploadImg()" :loading="loading2">حفظ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {
  data() {
    return {
      bookNum: "",
      descrb: "",
      mtba3a: "",
      katib: "",
      bookCode: "",
      nameBook: "",
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      file: null,
      bookFile: null,
      labID: "",
      labOption: [],
      show1: false,

      roleId: "",
      roleOption: [
        { text: "اداري", value: 1 },
        { text: "صاحب مختبر", value: 2 }
      ],

      search: "",
      loading2: false,
      name: "",
      username: "",
      password: "",
      email: "",
      number: "",
      detailsDialog: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      headers: [
        { sortable: false },
        { text: "اسم الكتاب  ", value: "name" },
        { text: "كود الكتاب  ", value: "code" },
        { text: "اسم الكاتب ", value: "authorName" },
        { text: " الصنف ", value: "sectionName" },
        { text: " تاريخ الطباعة ", value: "date2" },
        { text: "العمليات", value: "actions" }
      ],
      items: [],
      coontractCount: [],
      loading: false,
      img_path: "",
      book_path: ""
    };
  },
  methods: {
    uploadImg() {
      if (this.file) {
        this.loading2 = true;
        let formData = new FormData();
        formData.append("file", this.file);

        axios
          .post("book/upload", formData)
          .then(data => {
            console.log(data.data);
            this.img_path = data.data.path;
            this.uploadBook();
          })
          .catch(function() {
            Swal.fire("خطا في رفع الصورة");
            this.loading2 = false;
          });
      } else {
        Swal.fire({
          title: "يجب اختيار صورة للكتاب",
          icon: "error",
          confirmButtonText: "اغلاق"
        });
      }
    },
    uploadBook() {
      if (this.bookFile) {
        this.loading2 = true;
        let formData = new FormData();
        formData.append("file", this.bookFile);

        axios
          .post("book/upload", formData)
          .then(data => {
            console.log(data.data);
            this.book_path = data.data.path;
            this.addLap();
          })
          .catch(function() {
            Swal.fire("خطا في رفع الملف");
            this.loading2 = false;
          });
      } else {
        Swal.fire({
          title: "يجب اختيار ملف الكتاب",
          icon: "error",
          confirmButtonText: "اغلاق"
        });
      }
    },
    addLap() {
      if (
        this.descrb &&
        this.mtba3a &&
        this.katib &&
        this.bookCode &&
        this.bookNum &&
        this.date &&
        this.roleId &&
        this.nameBook &&
        this.book_path &&
        this.img_path
      ) {
        this.loading2 = true;
        const userData = {
          Name: this.nameBook,
          Code: this.bookCode,
          SectionId: this.roleId,
          Note: this.descrb,
          AuthorName: this.katib,
          NamePrinting: this.mtba3a,
          Date: this.date,
          Path: this.book_path,
          Photos: [this.img_path],
          ShelfNumber: this.bookNum
        };
        console.log(userData);
        axios
          .post("book/create", userData)
          .then(res => {
            this.rnData();
            this.loading2 = false;
            this.detailsDialog = false;
            Swal.fire({
              title: "تمت عملية الاضافة بنجاح",
              icon: "success",
              confirmButtonText: "اغلاق"
            });
          })
          .catch(err => {
            this.loading2 = false;
            Swal.fire({
              title: "كود الكتاب  موجود",
              icon: "error",
              confirmButtonText: "اغلاق"
            });
          });
      } else {
        Swal.fire({
          title: "تاكد من ادخال المعلومات",
          icon: "error",
          confirmButtonText: "اغلاق"
        });
      }
    },
    rnData() {
      this.loading = true;
      axios
        .get("book/show")
        .then(res => {
          this.loading = false;
          this.items = res.data.result.book;
          for (const val of this.items) {
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
          this.labOption = res.data.result.section;
          for (let i = 0; i < this.labOption.length; i++) {
            this.labOption[i].value = this.labOption[i].id;
            this.labOption[i].text = this.labOption[i].name;
          }
        })
        .catch(err => {});
    },
    delet(id) {
      Swal.fire({
        title: "هل انت متاكد من الحذف ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم",
        cancelButtonText: "لا"
      }).then(result => {
        if (result.value) {
          axios
            .delete("Lab/deleteUser?ID=" + id)
            .then(res => {
              this.rnData();
              Swal.fire({
                title: "تمت عملية الحذف بنجاح",
                icon: "success",
                confirmButtonText: "اغلاق"
              });
            })
            .catch(err => {
              Swal.fire({
                title: "فشلت عمليت الحذف",
                icon: "error",
                confirmButtonText: "اغلاق"
              });
            });
        }
      });
    },
    edit() {
      this.detailsDialog = true;
    }
  },
  created() {
    this.rnData();
    this.getlab();
  }
};
</script>
