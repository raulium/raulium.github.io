---
layout: post
title:  "Game Catalogue Progress"
date:   2019-12-26
categories: gaming
---

## Progress

<div class="progress">
    <div id="complete" class="progress-bar progress-bar-success" role="progressbar">
        Complete
    </div>
    <div id="in-progress" class="progress-bar progress-bar-warning" role="progressbar">
    </div>
    <div id="incomplete" class="progress-bar progress-bar-danger" role="progressbar">
        Incomplete
    </div>
    <div id="deprecated" class="progress-bar progress-bar-info" role="progressbar">
    </div>
</div>

## Game Catalog

<script src="https://unpkg.com/bootstrap-table@1.15.5/dist/bootstrap-table.min.js"></script>
<link href="https://unpkg.com/bootstrap-table@1.15.5/dist/bootstrap-table.min.css" rel="stylesheet">

<table
        id="table"
        data-toggle="table"
        data-toolbar=".toolbar"
        data-sortable="true"
        data-height="500">
    <thead>
    <tr>
        <th data-field="Platform" data-sortable="true">Platform</th>
        <th data-field="Title" data-sortable="true">Title</th>
        <th data-field="Status" data-sortable="true">Status</th>
    </tr>
    </thead>
</table>

<script>
  $(function() {
    $('#sortable').change(function () {
      $('#table').bootstrapTable('refreshOptions', {
        sortable: $('#sortable').prop('checked')
      })
    })
  })
</script>

<script>

$.getJSON("{{ site.baseurl }}/assets/data/gamecatalog.json", function(json) {
    var counts = {};
    var total = json.length;
    for (var i = 0; i < json.length; i++) {
        var val = json[i].Status;
        counts[val] = counts[val] ? counts[val] + 1 : 1;
    }

    function n(k) { return counts[k] || 0; }
    var c = (n('Complete')/total)*100;
    var p = (n('In Progress')/total)*100;
    var i = ((n('Incomplete') + n('UNK'))/total)*100;
    var d = (n('Deprecated')/total)*100;

    $('#complete').css('width', c + '%');
    $('#in-progress').css('width', p + '%');
    $('#incomplete').css('width', i + '%');
    $('#deprecated').css('width', d + '%');

    /* Table is already initialized by data-toggle="table", so load rows into it. (Use block comments here: the compress layout joins lines.) */
    $('#table').bootstrapTable('load', json);
});

</script>