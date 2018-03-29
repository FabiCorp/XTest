import React from 'react';
import ReactDOM from 'react-dom';
import { Image, Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

import { Grid, Row, Col, Button, DropdownButton, MenuItem  } from 'react-bootstrap'
	

import './index.css';

class ColoredRect extends React.Component {
    state = {
        color: 'green',
        isDrawing: false
    };
    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    componentDidMount() {
        console.log("mounted")
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const context = canvas.getContext("2d");

        this.setState({ canvas, context });
    }

    handleMouseDown = () => {
        this.setState({ isDrawing: true });
        const stage = this.image.getStage();
        this.lastPointerPosition = stage.getPointerPosition();
    };

    handleMouseUp = () => {
        this.setState({ isDrawing: false });
    };

    handleMouseMove = ({ evt }) => {
        const { context, isDrawing } = this.state;

        console.log('evt moved', evt.buttons, ' state: ', this.state.isDrawing);

        if (isDrawing) {
            context.strokeStyle = "#df4b26";
            context.lineJoin = "round";
            context.lineWidth = 5;

            if (evt.buttons === 1) {
                // draw
                context.globalCompositeOperation = "source-over";
            } else if (evt.buttons === 2) {
                // erase
                context.globalCompositeOperation = "destination-out";
            }
            context.beginPath();

            var localPos = {
                x: this.lastPointerPosition.x - this.image.x(),
                y: this.lastPointerPosition.y - this.image.y()
            };
            context.moveTo(localPos.x, localPos.y);
            console.log('M:',localPos.x,localPos.y)
            const stage = this.image.getStage();

            var pos = stage.getPointerPosition();
            localPos = {
                x: pos.x - this.image.x(),
                y: pos.y - this.image.y()
            };
            console.log('T:',localPos.x,localPos.y)
            context.lineTo(localPos.x, localPos.y);
            context.closePath();
            context.stroke();
            this.lastPointerPosition = pos;
            this.image.getLayer().draw();
        }
    };

    render() {
        const {canvas} = this.state;

        return (

            <Image
                image={canvas}
                ref={node => (this.image = node)}
                width={220}
                height={250}
                stroke="blue"

                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
            />
           
        );
    }
}

class Snippet extends React.Component {

    constructor(props)
    {
        super(props)
        this.myClick = this.myClick.bind(this)
    }

    render(){
        return(
        <Button bsStyle="primary" id={this.props.id} onClick={this.myClick} >Snippet {this.props.id} </Button>
        )
    }
    myClick(e) {
        console.log('Snippet: ' + e.target.id + ' clicked')
        this.props.canvasf(e.target.id)
    }
}

class SnippetWindow extends React.Component {
    render() {
        return (
            <div>
                <Snippet canvasf = {this.props.canvasf} id="A"/>
                <Snippet canvasf = {this.props.canvasf} id="B"/>
                <Snippet canvasf = {this.props.canvasf} id="C"/>
                <Snippet canvasf = {this.props.canvasf} id="D"/>
            </div>
        )
    }
}

class Canv extends React.Component {


    render() {
        return(
            <div id={"stage-parent"}>
            <Stage container={this.props.container} width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <Text text="Try click on rect" />

                    <ColoredRect />
                </Layer>
            </Stage>
            </div>
        )
    }

    callBack(val) {
        alert("XXX" + val)
    }
}


class Styles extends React.Component {
    render() {
        return (
            <div className="myStyles">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous">

        </link>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossOrigin="anonymous">
            </link>
            </div>)
    }
}

class Menubar extends React.Component {
	
  	render() {
        return (
            <div>

                <Button bsStyle="primary" id="AAA" onClick={this.myClick} >Primary</Button>

                <DropdownButton
                    title="ABC"
                    key="S"
                    id="MYIF"
                >
                    <MenuItem eventKey="1" onClick={this.myClick}>Action</MenuItem>
                    <MenuItem eventKey="2">Another action</MenuItem>
                    <MenuItem eventKey="3" active>
                        Active Item
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey="4">Separated link</MenuItem>
                </DropdownButton>
            </div> )
	}
	myClick(e) { console.log("Menue Action")}
}







class Editor extends React.Component {
    constructor(props){
        super(props)
        this.editorCallback = this.editorCallback.bind(this)

    }

    editorCallback(val)
    {
        this._canv.callBack(val)
    }

    render() {
        return (
            <div className="teachIt">
                <Styles/>
                <Grid>
                   <Row className="border border-pimary">
                       <Col style={{border : '2px solid #000000'}} xs={12}>
                       <Menubar/>
                       </Col>
                   </Row>
                    <Row>
                        <Col id="canvas-col" style={{border : '2px solid #000000'}} xs ={10}>
                            <Canv container="canvas-col" ref={(canv) => {this._canv = canv}}/>
                        </Col>
                        <Col xs={2} style={{border : '2px solid #000000'}} >
                          <SnippetWindow canvasf={this.editorCallback}/>

                        </Col>
                    </Row>
                </Grid>

            </div>


    );
    }
}

// ========================================

ReactDOM.render(
<Editor />,
    document.getElementById('root')
);
