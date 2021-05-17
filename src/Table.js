document.getElementById("make-it-table").addEventListener("click", function(event) {
    document.getElementById("table-input").classList.toggle("hide");

    var selection = window.getSelection();

    document.getElementById("confirm-table").onclick = function(event) {
        document.getElementById("table-input").classList.add("hide");
        var range = document.createRange();

        range.setStart(selection.anchorNode, selection.anchorOffset);
        selection.removeAllRanges();
        selection.addRange(range);

        var Content = '<center><table class="resizable newly-created-table" border="1"><caption>Table Caption Here</caption>';
        var rows = document.getElementById("table-rows").value, cols = document.getElementById("table-cols").value;
        if(document.getElementById("column-names").checked) {
            Content += '<tr>'

            if(document.getElementById("serial-number").checked) 
                Content += '<th>Sr. No.</th>';

            for(var j = 0; j < cols; ++j) 
                Content += '<th>Column '+String(j+1)+'</th>';
            Content += '</tr>';
        }
        for(var i = 0; i < rows; ++i) {
            Content += '<tr>'
            if(document.getElementById("serial-number").checked) 
                Content += '<td>'+String(i+1)+'</td>';
            
            for(var j = 0; j < cols; ++j) {
                Content += '<td>Content '+String(j+1)+'</td>';
            }
            Content += '</tr>';
        }
        Content += '</table></center>';
        document.execCommand("insertHTML", false, Content);
    }
});
