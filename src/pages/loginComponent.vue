<template>
  <div class="q-app">
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <q-page class="flex flex-center bg-dark">
          <q-card class="q-pa-md shadow-2 my_card" bordered>
            <q-card-section class="text-center">
              <div class="text-grey-9 text-h5 text-weight-bold">
                Inicio de Sesión
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                dense
                outlined
                v-model="email"
                label="Correo electrónico"
              ></q-input>
              <q-input
                dense
                outlined
                class="q-mt-md"
                v-model="password"
                type="password"
                label="Contraseña"
              ></q-input>
            </q-card-section>
            <q-card-section>
              <q-btn
                style="border-radius: 8px"
                color="dark"
                rounded
                size="md"
                label="Iniciar Sesión"
                no-caps
                class="full-width"
                @click="login"
              ></q-btn>
            </q-card-section>
            <q-card-section class="text-center q-pt-none">
              <div class="text-grey-8">
                No tienes una cuenta?
                <a
                  href="/#/registro"
                  class="text-dark text-weight-bold"
                  style="text-decoration: none"
                  >Registrarse</a
                >
              </div>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { login } from '../services/auth';

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      try {
        const user = await login(this.email, this.password);
        console.log('Inicio de sesión exitoso:', user);
        this.$router.push('/home');
      } catch (error: any) {
        this.errorMessage = error.message;
        console.error('Error de inicio de sesión:', error);
      }
    },
  },
});
</script>

<style>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
