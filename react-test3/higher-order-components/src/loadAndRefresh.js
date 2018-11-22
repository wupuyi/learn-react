import React, {Component} from 'react';

class Post extends Component {

  constructor() {
    super();
    this.state = {
      content: ''
    }
  }

  async loadContent () {
    this.setState({
      content: '数据加载中...'
    });

    let myContent = await getPostData()
    this.setState({ content: myContent });
  }

  componentWillMount () {
    this.setState({
      content: '数据加载中...'
    })
  }

  componentDidMount() {
    this.loadContent();
  }

  render () {
    return (
      <div>
        <div className="post-content"></div>
        <button onClick={() => this.loadContent()}>刷新</button>
      </div>
    )
  }
}