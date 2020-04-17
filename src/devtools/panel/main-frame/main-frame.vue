<template>
  <div class="main_frame">
    <table class="filter_configuration grid">
      <tr class="title grid_header">
        <th>UrlPattern</th>
        <th>RegExp</th>
        <th>Replacement</th>
        <th></th>
        <th>Enabled</th>
      </tr>
      <tr v-for="[id_name, conf] in Array.from(filterConf)" :key="id_name" class="configuration_row">
        <td>
          <textarea
            v-model="conf.urlPattern"
            placeholder="https?://example.com"
            :disabled="id_name != state.editingId"
          ></textarea>
        </td>
        <td>
          <textarea v-model="conf.matchRegExp" placeholder :disabled="id_name != state.editingId"></textarea>
        </td>
        <td>
          <textarea v-model="conf.replaceString" placeholder :disabled="id_name != state.editingId"></textarea>
        </td>
        <td>
          <button
            v-on:click="handleEditSave(id_name, $event)"
          >{{ id_name== state.editingId ?'Save':'Edit' }}</button>
        </td>
        <td>
          <input
            v-if="id_name != state.editingId"
            type="checkbox"
            name="enabled"
            :checked="isEnabled(id_name)"
            :disabled="id_name == state.editingId"
            v-on:change="handleToggleEnabled(id_name, $event)"
          />
          <button v-if="id_name == state.editingId" v-on:click="handleDeleteFilter(id_name)">Delete</button>
        </td>
      </tr>
    </table>
    <div>
      <button v-on:click="handleAddFilter()">Add Filter</button>
    </div>
  </div>
</template>

<script lang="ts" src="./main-frame.ts"></script>

<style>
</style>