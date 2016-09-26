<% if (isSearchEnabled) { %>
  <form class="CDB-Widget-search js-form">
    <div class="CDB-Shape CDB-Widget-searchLens u-iBlock u-rSpace js-searchIcon">
      <span class="CDB-Shape-magnify is-small is-blue"></span>
    </div>
    <input type="text" class="CDB-Text CDB-Size-large CDB-Widget-textInput CDB-Widget-searchTextInput js-textInput" value="<%- q %>" placeholder="Search by <%- columnName %>"/>
    <% if (canShowApply) { %>
      <button type="button" class="CDB-Text is-semibold u-upperCase CDB-Size-small CDB-Widget-searchApply js-applyLocked u-actionTextColor">apply</button>
    <% } %>
  </form>
<% } else { %>
  <div class="CDB-Widget-title CDB-Widget-contentSpaced js-title">
    <h3 class="CDB-Text CDB-Size-large u-ellipsis js-titleText" title="<%- title %>"><%- title %></h3>
    <div class="CDB-Widget-options CDB-Widget-contentSpaced">
      <button class="CDB-Widget-buttonIcon CDB-Widget-buttonIcon--circle js-colors
        <%- isAutoStyle ? 'is-selected' : '' %>
        <%- isAutoStyle ? 'js-cancelAutoStyle' : 'js-autoStyle' %>
        " data-tooltip="
          <%- isAutoStyle ? 'Remove auto style' : 'Auto style' %>
        ">
        <i class="CDB-IconFont CDB-IconFont-drop CDB-IconFont--small CDB-IconFont--top"></i>
      </button>
      <div class='widget-dropdown'></div>
    </div>
  </div>
<% } %>
