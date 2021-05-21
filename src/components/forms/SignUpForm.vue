<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6" class="py-0">
          <validation-provider
            v-slot="{ errors }"
            name="First name"
            rules="required"
            :debounce="500"
          >
            <base-input
              v-model="firstName"
              :error-messages="errors"
              custom-label="First name"
              height="40"
            />
          </validation-provider>
        </v-col>
        <v-col cols="6" class="py-0">
          <validation-provider
            v-slot="{ errors }"
            name="Last name"
            rules="required"
            :debounce="500"
          >
            <base-input
              v-model="lastName"
              :error-messages="errors"
              custom-label="Last name"
              height="40"
            />
          </validation-provider>
        </v-col>
        <v-col cols="12" class="py-0">
          <validation-provider
            v-slot="{ errors }"
            name="Email address"
            rules="required|email"
            :debounce="500"
          >
            <base-input
              v-model="email"
              :error-messages="errors"
              custom-label="Email address"
              type="email"
              height="40"
            />
          </validation-provider>
        </v-col>
        <v-col cols="12" class="py-0">
          <validation-provider
            v-slot="{ errors }"
            name="Password"
            rules="required|min:6"
            :debounce="500"
          >
            <base-input
              v-model="password"
              :error-messages="errors"
              custom-label="Create password"
              type="password"
              height="40"
            />
          </validation-provider>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'
import UserRegistrationForm from '@/types/UserRegistrationForm'
import { ValidationProvider, extend } from 'vee-validate'
import { required, email, min } from 'vee-validate/dist/rules'

extend('required', required)
extend('email', email)
extend('min', {
  ...min,
  message: '{_field_} may not be less than {length} characters'
})

@Component({ components: { ValidationProvider } })
export default class SignUpForm extends Vue {
  @Model('input', {
    type: Object as () => UserRegistrationForm,
    required: true
  })
  readonly userForm!: UserRegistrationForm

  get firstName (): string {
    return this.userForm.first_name
  }

  set firstName (value: string) {
    this.$emit('input', { ...this.userForm, ...{ first_name: value } })
  }

  get lastName (): string {
    return this.userForm.last_name
  }

  set lastName (value: string) {
    this.$emit('input', { ...this.userForm, ...{ last_name: value } })
  }

  get email (): string {
    return this.userForm.email
  }

  set email (value: string) {
    this.$emit('input', { ...this.userForm, ...{ email: value } })
  }

  get password (): string {
    return this.userForm.password
  }

  set password (value: string) {
    this.$emit('input', { ...this.userForm, ...{ password: value } })
  }
}
</script>
