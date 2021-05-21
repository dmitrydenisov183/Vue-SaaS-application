<template>
  <v-container class="py-0 pt-15" fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="new-password mx-auto pa-4 px-11 mt-3" width="560px" elevation="0">
          <img class="d-block mx-auto mt-4" src="@/assets/img/full-logo.png" alt="">
          <v-card-title class="px-2 pb-0 pt-6">
            <div class="new-password__title text-capitalize">Reset your password</div>
          </v-card-title>
          <v-divider class="mx-2 my-2" />
          <validation-observer v-slot="{ invalid }" @keydown.enter="onSubmit">
            <div class="px-2">
              <validation-provider
                v-slot="{ errors }"
                vid="confirm"
                name="New password"
                rules="required|min:6"
                :debounce="500"
              >
                <base-input
                  v-model="passwordForm.new_password"
                  custom-label="New password"
                  :error-messages="errors"
                  type="password"
                />
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Confirm password"
                rules="required|min:6|password:@confirm"
                :debounce="500"
              >
                <base-input
                  v-model="passwordForm.confirm_password"
                  custom-label="Confirm password"
                  :error-messages="errors"
                  type="password"
                />
              </validation-provider>
            </div>
            <v-card-actions class="py-0 pb-6 mt-2">
              <base-button
                class="text-capitalize font-weight-bold"
                variant="secondary"
                :disabled="invalid"
                :loading="isLoading"
                large
                block
                tile
                @click="onSubmit"
              >
                Reset password
              </base-button>
            </v-card-actions>
          </validation-observer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import ResetPasswordForm from '@/types/ResetPasswordForm'
import { required, min } from 'vee-validate/dist/rules'
import RequestStatus from '@/constants/RequestStatus'
import UserRepository from '@/data/repository/UserRepository'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import { getErrorMessage, sendFlashMessage } from '@/utils/misc'

extend('required', required)
extend('min', min)
extend('password', {
  params: ['target'],
  validate (value: any, { target }: any) {
    return value === target
  },
  message: 'Password confirmation does not match'
})

@Component({ components: { ValidationObserver, ValidationProvider } })
export default class TheNewPassword extends Vue {
  status: RequestStatus = RequestStatus.Initial
  passwordForm: ResetPasswordForm = {
    token: this.token,
    new_password: '',
    confirm_password: ''
  }

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  get token (): string {
    return this.$route.query.token as string
  }

  async onSubmit (): Promise<void> {
    if (this.isLoading) return

    this.status = RequestStatus.Loading

    const response = await new UserRepository().passwordReset(this.passwordForm)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    this.status = RequestStatus.Success
    this.$router.push({ name: 'login' })

    sendFlashMessage({
      status: 'success',
      message: 'Your password was successfully reset. Please log into your account.'
    })
  }

  mounted () {
    if (!this.token) this.$router.push({ name: 'login' })
  }
}
</script>

<style lang="scss" scoped>
  .new-password {
    &__title {
      font-family: $base-font;
      font-size: $font-md-x;
      color: $color-mako;
      font-weight: $font-weight-bold;
    }
  }
</style>
