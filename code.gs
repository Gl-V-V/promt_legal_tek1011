function myFunction() {
  const apiKey = 'ЗДЕСЬ УКАЖИТЕ ТОКЕН OpenAI'
  const body = DocumentApp.getActiveDocument().getBody()
  const table = body.getTables()
  let txt
  for(i=0; i<table[0].getNumRows();i++){
    if (table[0].getRow(i).getCell(1).getText() === '') {
        txt = table[0].getRow(i).getCell(0).getText()

        const features = `You are a highly qualified lawyer, you will receive the company's terms of use in Russian: ${txt}, your task is to simplify this text to a layman's text in Russian, but you must preserve the legal meaning of the original in the text. Please do not provide me with a sample, create the entire document in one go.`
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        const options = {
          method: 'post',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          muteHttpExceptions: true,
          payload: JSON.stringify(
          {
          "model": "gpt-3.5-turbo-16k",
          "messages": [{
                        "role": "user", 
                        "content": features,
                        }],
          "temperature": 0.7
          }),
        };
        const response = UrlFetchApp.fetch(apiUrl, options);
        const content = response.getContentText();
        console.log(content)

        let json = JSON.parse(content)

        if (json.error) {
          return json.error.message
        }

        table[0].getRow(i).getCell(1).setText(json.choices[0].message.content) 
    }
  }
}
