<template>
  <div class="main_frame">
    <!-- TODO: Very cumbersome. If gets bigger, add vuex -->
    <filter-configurations
      :filterConf="filterConf"
      @saveConfigurations="handleSaveConfigurations"
      @setFilterEnabled="handleSetFilterEnabled"
      @deleteConfiguration="handleDeleteConfiguration"
      @addNewConfiguration="handleAddNewConfiguration"
    ></filter-configurations>
    <license-notation></license-notation>
  </div>
</template>

<script lang="ts" src="./main-frame.ts"></script>

<style>
</style>