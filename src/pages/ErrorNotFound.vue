<template>
  <q-page class="column flex-center text-center q-pa-xl">
    <div class="err-code brand-gradient-text">404</div>
    <div class="text-h5 font-brand q-mt-sm">Página não encontrada</div>
    <p class="text-ink-2 q-mt-sm">A página que você procura não existe ou foi movida.</p>
    <q-btn unelevated no-caps color="primary" class="q-mt-md" icon="sym_o_home"
           label="Voltar ao início" :to="{ name: 'dashboard' }" />
  </q-page>
</template>

<style scoped>
.err-code { font-family: 'Exo 2', sans-serif; font-weight: 800; font-size: 96px; line-height: 1; }
</style>
