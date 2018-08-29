// 通过集成Component构建
class HelloWorld extends Component {
  constructor() {
    super()
  }

  sayHi () {
    alert('Hello World')
  }

  render () {
    return (
      <div onClick={this.sayHi.bind(this)}>Hello World</div>
    )
  }
}

// 通过函数式
const HelloWorld = (props) => {
  const sayHi = (event) => alert('Hello World')
  return (
    <div onClick={sayHi}>Hello World</div>
  )
}