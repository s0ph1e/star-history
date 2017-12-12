import React, { Component } from 'react';
import {ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, Legend} from 'recharts';
import './style.css'

class StarHistoryGraph extends Component {
	render() {
		const {data} = this.props;
		const hasData = !!data;

		if (!hasData) {
			return <div className="empty-graph"></div>
		}
		return (
			<ResponsiveContainer height={500} width="100%">
				<LineChart data={data} margin={{top: 50}}>
					<XAxis dataKey="month" padding={{left: 30, right: 30}} />
					<YAxis />
					<Tooltip />
					<Legend verticalAlign="bottom" height={36}/>
					<Line type='monotone' dataKey='amount'
						  name="amount of stars"
						  stroke='#8884d8'
						  strokeWidth={2}
						  dot={false}
						  legendType='star'
					/>
				</LineChart>
			</ResponsiveContainer>
		)
	}
}

export default StarHistoryGraph;