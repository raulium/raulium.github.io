---
layout: post
title:  "Game Catalogue Progress"
date:   2019-12-26
categories: gaming
---

<script>

$.getJSON("https://harnasch.com/assets/data/gamecatalog.json", function(json) {
    var counts = {};
    var total = json.length;
    for (var i = 0; i < json.length; i++) {
        var val = json[i].Status;
        counts[val] = counts[val] ? counts[val] + 1 : 1;
    }

    console.log(counts);

    var c = (counts['Complete']/total)*100;
    var p = (counts['In Progress']/total)*100;
    var i = ((counts['Incomplete'] + counts['UNK'])/total)*100;
    var d = (counts['Deprecated']/total)*100;

    console.log(c);
    console.log(p);
    console.log(i);
    console.log(d);

    $('#complete').css('width', c + '%');
    $('#progress').css('width', p + '%');
    $('#incomplete').css('width', i + '%');
    $('#deprecated').css('width', d + '%');

    $('#table').bootstrapTable({
        data: json
    });
});

</script>

## Progress

<div class="progress">
    <div id="complete" class="progress-bar progress-bar-success" role="progressbar">
        Complete
    </div>
    <div id="progress" class="progress-bar progress-bar-warning" role="progressbar">
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