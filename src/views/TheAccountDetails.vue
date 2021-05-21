<template>
  <div class="account-details">
    <base-tabs v-model="activeTab">
      <v-tab>Details</v-tab>
    </base-tabs>
    <base-tabs-items v-model="activeTab">
      <v-tab-item>
        <v-container fluid>
          <v-row v-if="user">
            <v-col cols="12" md="10" lg="8">
              <div class="account-details__title mb-1">
                Account Information
              </div>
              <v-divider />
              <div class="mt-3 mb-2">{{ userFullName }}</div>
              <div>{{ user.data.email }}</div>
            </v-col>
          </v-row>
          <v-row class="mt-16">
            <v-col cols="12" md="10" lg="8">
              <div class="account-details__title mb-1">
                Change password
              </div>
              <v-divider />
                <validation-observer :key="formKey" v-slot="{ invalid }">
                  <v-row class="mt-4">
                      <v-col cols="12" md="4" class="d-flex align-end">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Old password"
                          rules="required"
                          :debounce="500"
                        >
                          <base-input
                            v-model="passwordForm.old_password"
                            custom-label="Old password"
                            :error-messages="errors"
                            variant="normal"
                            type="password"
                            class="account-details__input pb-5"
                          />
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="4" class="d-flex align-end">
                        <validation-provider
                          v-slot="{ errors }"
                          name="New password"
                          rules="required|min:6"
                          :debounce="500"
                        >
                          <base-input
                            v-model="passwordForm.new_password"
                            custom-label="New password"
                            :error-messages="errors"
                            variant="normal"
                            type="password"
                            class="account-details__input pb-5"
                          />
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="4" class="d-flex align-end">
                        <base-button
                          class="account-details__submit text-capitalize px-6 mb-5"
                          :loading="isPasswordChangeLoading"
                          :disabled="invalid"
                          @click="onPasswordChange"
                        >
                          Save
                        </base-button>
                      </v-col>
                  </v-row>
                </validation-observer>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </base-tabs-items>
    <v-overlay :value="isLoading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import RequestStatus from '@/constants/RequestStatus'
import UserRepository from '@/data/repository/UserRepository'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import User from '@/types/User'
import { getErrorMessage, sendFlashMessage } from '@/utils/misc'
import { AxiosResponse } from 'axios'
import { Component, Vue } from 'vue-property-decorator'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import ChangePasswordForm from '@/types/ChangePasswordForm'
import { required, min } from 'vee-validate/dist/rules'

extend('required', required)
extend('min', min)

@Component({ components: { ValidationObserver, ValidationProvider } })
export default class TheAccountDetails extends Vue {
  activeTab = 0
  status: RequestStatus = RequestStatus.Initial
  changePasswordStatus: RequestStatus = RequestStatus.Initial
  user: User | null = null
  passwordForm: ChangePasswordForm = {
    old_password: '',
    new_password: ''
  }

  formKey = 1

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  get isPasswordChangeLoading (): boolean {
    return this.changePasswordStatus === RequestStatus.Loading
  }

  get userFullName (): string | null {
    return this.user && `${this.user.data.first_name} ${this.user.data.last_name}`
  }

  async fetch (): Promise<void> {
    if (this.isLoading) return

    this.status = RequestStatus.Loading

    const response = await new UserRepository().fetch()

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    this.user = (response as AxiosResponse<User>).data
    this.status = RequestStatus.Success
  }

  async onPasswordChange (): Promise<void> {
    if (this.isPasswordChangeLoading) return

    this.changePasswordStatus = RequestStatus.Loading

    const response = await new UserRepository().changePassword(this.passwordForm)

    if (isFailureResponse(response)) {
      this.changePasswordStatus = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    this.changePasswordStatus = RequestStatus.Success
    this.passwordForm = { new_password: '', old_password: '' }
    this.formKey++
    sendFlashMessage({
      status: 'success',
      message: 'Password was successfully changed'
    })
  }

  mounted () {
    this.fetch()
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .v-input {
      height: 40px;
      width: 230px;
    }
  }

  .account-details {
    font-family: $label-font;
    width: 100%;
    background-color: #FFFFFF;
    &__title {
      font-size: $font-md-x;
      font-weight: $font-weight-bold;
    }
    &__input {
      margin-bottom: 0 !important;
      width: 100%;
    }
    &__submit {
      height: 40px !important;
    }
  }
</style>
