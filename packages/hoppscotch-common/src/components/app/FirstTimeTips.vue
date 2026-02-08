<template>
  <HoppSmartModal
    v-if="show"
    dialog
    :title="t('onboarding.title')"
    styles="sm:max-w-lg"
    @close="dismiss"
  >
    <template #body>
      <div class="flex flex-col space-y-4">
        <!-- Step indicator -->
        <div class="flex items-center justify-center space-x-1.5">
          <button
            v-for="(_, index) in steps"
            :key="index"
            class="h-2 rounded-full transition-all duration-200"
            :class="
              index === currentStep
                ? 'w-6 bg-accent'
                : 'w-2 bg-divider hover:bg-dividerDark'
            "
            @click="currentStep = index"
          />
        </div>

        <!-- Step counter -->
        <p class="text-center text-tiny text-secondaryLight">
          {{
            t("onboarding.step_of", {
              current: currentStep + 1,
              total: steps.length,
            })
          }}
        </p>

        <!-- Step content -->
        <div class="flex flex-col items-center space-y-3 px-4 py-2 text-center">
          <!-- Step number badge -->
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-primaryLight text-accent font-bold text-lg"
          >
            {{ currentStep + 1 }}
          </div>

          <h3 class="text-lg font-semibold text-secondaryDark">
            {{ t(steps[currentStep].titleKey) }}
          </h3>

          <p class="text-secondary leading-relaxed">
            {{ t(steps[currentStep].descriptionKey) }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-between">
        <HoppButtonSecondary
          :label="t('onboarding.skip')"
          outline
          @click="dismiss"
        />
        <div class="flex space-x-2">
          <HoppButtonSecondary
            v-if="currentStep > 0"
            :label="t('onboarding.back')"
            outline
            filled
            @click="prevStep"
          />
          <HoppButtonPrimary
            v-if="currentStep < steps.length - 1"
            :label="t('onboarding.next')"
            outline
            @click="nextStep"
          />
          <HoppButtonPrimary
            v-else
            :label="t('onboarding.done')"
            outline
            @click="dismiss"
          />
        </div>
      </div>
    </template>
  </HoppSmartModal>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "~/composables/i18n"

const t = useI18n()

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: "hide-modal"): void
}>()

const steps = [
  {
    titleKey: "onboarding.steps.create_request.title",
    descriptionKey: "onboarding.steps.create_request.description",
  },
  {
    titleKey: "onboarding.steps.save_to_collections.title",
    descriptionKey: "onboarding.steps.save_to_collections.description",
  },
  {
    titleKey: "onboarding.steps.import_file.title",
    descriptionKey: "onboarding.steps.import_file.description",
  },
  {
    titleKey: "onboarding.steps.use_environments.title",
    descriptionKey: "onboarding.steps.use_environments.description",
  },
] as const

const currentStep = ref(0)

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const dismiss = () => {
  currentStep.value = 0
  emit("hide-modal")
}
</script>
