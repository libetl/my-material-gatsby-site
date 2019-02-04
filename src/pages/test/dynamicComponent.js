import React from "react"
import TemplateWrapper from '../../templates/TemplateWrapper'

export default class DynamicComponent extends React.Component {

    state={color: 'black'}
    colors=['black', 'red', 'yellow', 'blue', 'pink', 'purple', 'orange', 'green', 'grey']
    render = () => (<div>
          <TemplateWrapper overridenTitle="Dynamic component test"/>
          <div className="content">
            <div className="doc-item-content">
              <h1 style={{color: this.state.color}}>A very dynamic component</h1>
              <input type="button"
              onClick={() => this.setState({color: this.colors[Math.floor(Math.random() * this.colors.length)]})}
              value="Shuffle the color"/>
            </div>
          </div>
      </div>)


}
