
// TODO: Dont work if not login
chrome.commands.onCommand.addListener(function(command) {
  /*
   * Highlight text and save it on server
   */
  if (command == "highlight-selected-text"){
    getCurrentTab(function(tab){
      // send message to tab to get text
      chrome.tabs.sendMessage(tab.id, {method: "get_selected_text"}, function(resp){
        // save on server -- create data
        console.log(resp.data)
        var data = JSON.stringify({
          url: tab.url,
          text: resp.data,
          title: tab.title,
          category: "Project",
          tags: ["chrome", "testing"],
          comment: "This is very important"
        })
        console.log(data)
        // request function
        var request = function(token){
          $.ajax({
            type: "POST",
            url: 'http://anotode.herokuapp.com/api/highlights?token=' + token,
            contentType: 'application/json; charset=utf-8',
            data: data,
            success: function(data, textStatus, jqXHR){
              console.log(data)
              consoleLogContent("Highlighted text saved")
            },
            error: function(jqXHR, textStatus, errorThrown){
              console.log(textStatus + " " + errorThrown)
            },
            dataType: 'json'
          })
        }
        // get token and do request
        getKey("token", function(token){
          request(token)
        })
      })
    })
  }
})


// http://stackoverflow.com/questions/7303452/how-to-get-current-tabid-from-background-page
function getCurrentTab(tabCallback) {
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {
      tabCallback(tabArray[0])
    }
  )
}


// console log content script
function consoleLogContent(msg){
  getCurrentTab(function(tab){
    chrome.tabs.sendMessage(tab.id, {method: "console_log", data: "MSG: " + msg})
  })
}
