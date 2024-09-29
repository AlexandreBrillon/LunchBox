

class Contents {
  food string[]
}

function MyFunction(arg: image) -> Contents {
  client "openai/gpt-4o"
  prompt #"
    {{ _.role('user') }}
    {{ ctx.output_format }}
    {{ arg }}
  "#
}

test TestName {
  functions [MyFunction]
  args {
    arg { 
      url "https://messenger-news.com/wp-content/uploads/2021/12/fridge-leftovers-1.jpg"
    }
  }
}
