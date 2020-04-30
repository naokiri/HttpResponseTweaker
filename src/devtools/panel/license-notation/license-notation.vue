<template>
<!-- TODO: Only show the MIT like licenses that showing attribution is necessary. -->
  <div id="licenses">
    <div>License notation</div>
    <div>This extension is distributed and built with the following 3rd party libraries and tools. Complete license for each are available in each repository.</div>
    <div id="licenses_accordion"> 
      <input id="collapsible" class="toggle" type="checkbox">
      <label for="collapsible" class="toggle_label">See all</label>
      <div id="licenses_list">
        <div v-for="(license, key) in licenses" :key="key">
          <div>{{ key }} {{ license.publisher }} ({{ license.licenses }})</div>
          <div>{{ license.repository }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped> 
#licenses {
    font-size: xx-small;
}

input[type='checkbox'] {
  display: none;
}

.toggle_label {
  display: block;
}

.toggle_label::before {
  content: ' ';
  display: inline-block;

  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid currentColor;

  vertical-align: middle;
  margin-right: .7rem;
  transform: translateY(-2px);

  transition: transform .2s ease-out;
}

#licenses_list { 
  max-height: 0px;
  overflow: hidden;

  transition: max-height .25s ease-in-out;
}

.toggle:checked + .toggle_label + #licenses_list {
  max-height: 10000vh;
}

.toggle:checked + .toggle_label::before {
  transform: rotate(90deg) translateX(-3px);
}

.toggle:checked + .toggle_label {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>

<script lang="ts" src="./license-notation.ts"></script>