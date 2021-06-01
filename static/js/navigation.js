$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
  if (!$(this).next().hasClass('show')) {
    $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
  }
  var $subMenu = $(this).next(".dropdown-menu");
  $subMenu.toggleClass('show');


  $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
    $('.dropdown-submenu .show').removeClass("show");
  });


  return false;
});

function CloseAllNav(){
  $('.dropdown-submenu .show').removeClass("show");
}

var onDisp = []
var onReport = []


  function getData() {

    if(JSON.stringify(onDisp)!=JSON.stringify(Object.keys(VarData)) || Object.keys(VarData) == ""){

    onDisp = Object.keys(VarData)   ;
    var varDataStr = JSON.stringify(VarData);
  
    $.ajax({
      url: '/DataViewer',
      data: varDataStr,
      type: 'POST',
      success: function(response){

        response = response.substring(2, response.length-2);


        console.log(response)

        var responseList = response.split("', '")
        console.log(responseList);


        var keys = Object.keys(VarData);


        var result = {};
        keys.forEach((key, i) => result[key] = responseList[i]);
  
  
        document.getElementById("DataFrameViewer").innerHTML = "";
  


        for (var i = 0; i < Object.keys(VarData).length; i++) {
          (function () {
            
          var k = i;
          var DataViewer = document.getElementById("DataFrameViewer");
          var a = document.createElement('a');
          var link = document.createTextNode(Object.keys(VarData)[i])
          
          a.appendChild(link); 

          a.title = Object.keys(VarData)[i]
          a.className = "dropdown-item"


          a.addEventListener('click', function(){
            displayHTMLTable(responseList[k],Object.keys(VarData)[k],VarData);
          });
          DataViewer.appendChild(a);
          var breaker = document.createElement("br");
          DataViewer.appendChild(breaker);


        }());
      }
      },
      error: function(error){
        console.log(error);
      }
    });
}
  };
  
  function getReport(){

    console.log("WAAT");

    console.log(VarData);
    
    var varDataStr = JSON.stringify(VarData);
  
    $.ajax({
      url: '/DataReport',
      data: varDataStr,
      type: 'POST',
      success: function(response){

        response = response.substring(2, response.length-2);
  

        var responseList = response.split("', '")

        
  
        var keys = Object.keys(VarData);
     
  
        var result = {};
        keys.forEach((key, i) => result[key] = responseList[i]);
  
  
        document.getElementById("DataFrameReportViewer").innerHTML = "";
  
        
        for (var i = 0; i < Object.keys(VarData).length; i++) {
          (function () {
            
          var k = i;
          var DataViewer = document.getElementById("DataFrameReportViewer");
          var a = document.createElement('a');
          var link = document.createTextNode(Object.keys(VarData)[i])
          
          a.appendChild(link); 

          a.title = Object.keys(VarData)[i]
          a.className = "dropdown-item"
          console.log(responseList[k])
          a.addEventListener('click', function(){
            displayHTMLReport(responseList[k],Object.keys(VarData)[k],VarData);
          });
          DataViewer.appendChild(a);
          var breaker = document.createElement("br");
          DataViewer.appendChild(breaker);
        }()); // immediate invocation
      }
      },
      error: function(error){
        console.log(error);
      }
    });


  };




  function downloadPy(){

    var text = Blockly.Python.workspaceToCode(anyML.workspace);
    var fileType = "text"
    var fileName = "any1ml.py"
    var blob = new Blob([text], { type: fileType });

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);

  }

  function downloadIpynb(){

    var Codetext = Blockly.Python.workspaceToCode(anyML.workspace);
    var text = ("{ \"cells\": [ \n { \n \"cell_type\": \"code\", \n\"execution_count\": 1,\n\"metadata\": {}, \n\"outputs\": [],\n \"source\": [\n"+JSON.stringify(Codetext)+"\n]\n}\n],\n \"metadata\": {\n \"kernelspec\": {\n\"display_name\": \"Python 3\",\n\"language\": \"python\",\n\"name\": \"python3\"\n},\n\"language_info\": {\"codemirror_mode\": { \"name\": \"ipython\",\n \"version\": 3 \n},\n \"file_extension\": \".py\",\n\"mimetype\": \"text/x-python\", \n\"name\": \"python\", \n\"nbconvert_exporter\": \"python\",\n\"pygments_lexer\": \"ipython3\",\n\"version\": \"3.8.5\"\n} \n}, \n\"nbformat\": 4, \n\"nbformat_minor\": 2 \n}");
    var fileType = "text"
    var fileName = "any1ml.ipynb"
    var blob = new Blob([text], { type: fileType });
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);

  }

  function displayHTMLTable(stringdata,id,VarData){
    var tableHtml = window.open("/DataViewer", "_blank", "width="+screen.availWidth+", height="+screen.availHeight+"");


    tableHtml.onload = function () {
      var div = tableHtml.document.getElementsByTagName("body")[0];

      div.innerHTML =stringdata;

    }
  };

  function displayHTMLReport(stringdata,id,VarData){

    var tableHtml = window.open("/ReportViewer", "_blank", "width="+screen.availWidth+", height="+screen.availHeight+"");

    tableHtml.onload = function () {
      var div = tableHtml.document.getElementsByTagName("body")[0];

      div.innerHTML =stringdata;
    }

    //tableHtml.document.write(stringdata);  
  };