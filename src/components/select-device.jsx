
import {Component} from "react"

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@material-ui/core"

let idGen = 1;

export default class SelectDevice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: null,
            id: idGen++
        }
    }

    render() {
        const select = (value) => {
            const {onSelect = () => {}} = this.props;

            onSelect.apply(this, [value]);

            this.setState({
                value
            });
        }

        return (
            <FormControl style={this.props.style || {}}>
                <InputLabel id={`select-device-${this.state.id}`}>
                    {/* Make title disappear when value selected */}
                    {this.state.value === null ? this.props.title : ''}
                </InputLabel>
                <Select
                    fullWidth
                    labelId={`select-device-${this.state.id}`}
                    value={this.state.value}
                    onChange={(e) => select(e.target.value)}
                >
                    {this.props.devices.map((device) => (
                        <MenuItem value={device.value}>
                            {device.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}
