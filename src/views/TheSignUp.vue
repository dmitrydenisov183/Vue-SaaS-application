<template>
  <v-container class="py-0 pt-5" fluid>
    <v-row>
      <v-col cols="12">
        <div class="text-right">
          Already have an account? <router-link to="/login">Log in</router-link>.
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="sign-up mx-auto pa-8 mx-11 mt-3" width="560px" elevation="0">
          <base-alert v-if="isError" variant="error">
            {{ errorMessage }}
          </base-alert>
          <v-card-title>
            <div class="sign-up__title">The easiest way to warm up your inboxes.</div>
            <div class="sign-up__sub-title">Create an account, no credit card required.</div>
          </v-card-title>
          <validation-observer v-slot="{ invalid }" @keydown.enter="onSubmit">
            <sign-up-form v-model="userForm" />
            <v-card-actions class="py-0 px-3">
              <base-button
                class="text-capitalize font-weight-bold"
                variant="secondary"
                @click="onSubmit"
                :loading="isLoading"
                large
                block
                tile
                :disabled="invalid"
              >
                Sign up free
              </base-button>
            </v-card-actions>
          </validation-observer>
          <v-card-text>
            <div>
              By signing up you agree to the
              <a :href="`${baseUrl}/tos`" target="blank">terms of service</a> and
              <a :href="`${baseUrl}/privacy`" target="blank">privacy policy</a>.
            </div>
            <a :href="baseUrl" target="blank">
              <img class="d-block mx-auto mt-4" src="@/assets/img/full-logo.png" alt="">
            </a>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SignUpForm from '@/components/forms/SignUpForm.vue'
import UserRegistrationForm from '@/types/UserRegistrationForm'
import UserRepository from '@/data/repository/UserRepository'
import RequestStatus from '@/constants/RequestStatus'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import { ValidationObserver } from 'vee-validate'
import AuthModule from '@/store/modules/AuthModule'
import { AxiosResponse } from 'axios'
import { getErrorMessage } from '@/utils/misc'

@Component({ components: { SignUpForm, ValidationObserver } })
export default class TheSignUpForm extends Vue {
  status: RequestStatus = RequestStatus.Initial
  errorMessage = ''
  userForm: UserRegistrationForm = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    referred_by: this.refferalCode
  }

  get isError (): boolean {
    return this.status === RequestStatus.Error
  }

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  get refferalCode (): string | null {
    return this.$route.query.code ? this.$route.query.code as string : null
  }

  get baseUrl (): string {
    return process.env.VUE_APP_BASE_URL
  }

  async onSubmit (): Promise<void> {
    if (this.isLoading) return

    this.status = RequestStatus.Loading

    const response = await new UserRepository().register(this.userForm)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      this.errorMessage = getErrorMessage(response as FailureResponse)

      setTimeout(() => {
        this.status = RequestStatus.Initial
        this.errorMessage = ''
      }, 5000)

      return
    }

    await AuthModule.login(response as AxiosResponse<{ status: string; key: string }>)
    this.status = RequestStatus.Success
    window.location.href = '/inboxes'
  }
}
</script>

<style lang="scss" scoped>
  .sign-up {
    &__title {
      font-family: $base-font;
      font-size: $font-lg-x;
      color: $color-mako;
    }
    &__sub-title {
      font-family: $base-font;
      color: $color-oslo-gray;
      font-size: $font-md;
    }
  }
</style>
