<template>
  <div class="q-app">
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <q-page class="bg-dark">
          <div class="listImages">
            <div class="text-white text-h5 text-weight-bold">
              Lista de imagenes
            </div>
            <div class="tex-white text-p" v-if="loadImages">
              No hay imagenes para mostrar
            </div>
            <div v-if="!loadImages" class="flex flex-center">
              <q-card
                v-for="(imageUrl, index) in imageUrls"
                :key="index"
                class="q-mx-md"
              >
                <img :src="imageUrl" alt="" class="thumbnail" />
                <q-card-section>
                  <q-btn
                    round
                    color="secondary"
                    icon="delete"
                    @click="deleteImage(imageUrl)"
                  />
                  <q-btn
                    round
                    color="secondary"
                    icon="download"
                    @click="downloadImage(imageUrl)"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
          <hr />
          <div class="uploadImages">
            <div class="text-white text-h5 text-weight-bold">
              Subida de imagenes
            </div>
            <q-file
              color="black"
              bg-color="white"
              text-color="white"
              v-model="file"
              label="Subir imagen"
              accept="image/*"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <q-btn
              round
              color="secondary"
              icon="cloud_upload"
              @click="uploadImage"
            />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
    <canvas ref="canvas" style="display: none"></canvas>
  </div>
</template>

<script lang="ts">
import { getAuth } from 'firebase/auth';
import {
  getDownloadURL,
  getStorage,
  uploadBytes,
  ref as reference,
  listAll,
  deleteObject,
} from 'firebase/storage';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  data() {
    return {
      loadImages: true,
      file: null as File | null,
      user: getAuth().currentUser,
      imageUrls: [] as string[],
    };
  },
  methods: {
    async uploadImage() {
      const storage = getStorage();
      console.log('este es el usuario', this.user);
      try {
        if (!this.file) {
          console.log('no hay ningun archivo seleccionado');
          return;
        }
        const storageRef = reference(
          storage,
          `images/${this.user?.uid}/${this.file.name}`
        );
        const resizedImageBlob = await this.resizeImage(this.file, 720);
        const snapshot = await uploadBytes(storageRef, resizedImageBlob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('URL de descarga:', downloadURL);
      } catch (error) {
        console.error('error al subir imagen', error);
      }
    },
    async loadImagesFirebase() {
      const storage = getStorage();
      const imagesRef = reference(storage, `images/${this.user?.uid}`);
      try {
        const listResult = await listAll(imagesRef);
        this.imageUrls = await Promise.all(
          listResult.items.map(async (item) => {
            const downloadURL = await getDownloadURL(item);
            return downloadURL;
          })
        );
        this.loadImages = false;
        console.log(this.imageUrls);
      } catch (error) {
        console.error('Error al cargar imágenes', error);
      }
    },
    async resizeImage(file: File, maxWidth: number): Promise<Blob> {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            let newWidth = img.width;
            let newHeight = img.height;

            if (img.width > maxWidth) {
              newWidth = maxWidth;
              newHeight = (img.height * maxWidth) / img.width;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            canvas.toBlob((blob) => {
              resolve(blob as Blob);
            }, 'image/png');
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    },
    async deleteImage(imageUrl: string) {
      console.log(imageUrl);
      try {
        const storage = getStorage();
        const imageRef = reference(storage, imageUrl);

        await deleteObject(imageRef);

        this.imageUrls = this.imageUrls.filter((url) => url !== imageUrl);

        console.log('Imagen eliminada con éxito.');
      } catch (error) {
        console.error('Error al eliminar la imagen', error);
      }
    },

    downloadImage(imageUrl: string) {
      try {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.target = '_blank';
        link.download = 'nombre-de-la-imagen.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error al descargar la imagen', error);
      }
    },
  },
  mounted() {
    this.loadImagesFirebase();
  },
});
</script>

<style>
.listImages {
  margin: auto;
  display: table;
}
.uploadImages {
  margin: auto;
  display: table;
  margin-top: 20px;
}

.uploadImages q-btn {
  justify-content: center;
}
.thumbnail {
  max-width: 250px;
  max-height: 250px;
}
</style>
