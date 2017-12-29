import React, { Component } from 'react';
import {ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, Legend} from 'recharts';
import './style.css'

class StarHistoryGraph extends Component {
	render() {
		const {data} = this.props;
		const hasData = !!data.length;

		if (!hasData) {
			return <div className="empty-graph"></div>
		}
		return (
			<ResponsiveContainer height={500} width="100%">
				<LineChart data={data} margin={{top: 50}}>
					<XAxis dataKey="month" padding={{left: 10, right: 10}} />
					<YAxis />
					<Tooltip />
					<Legend verticalAlign="bottom" height={36}/>
					<Line type='monotone' dataKey='amount'
						  name="total amount of stars"
						  stroke='#80bdff'
						  strokeWidth={2}
						  dot={false}
						  legendType='star'
					/>
					<Line type='monotone' dataKey='increment'
						name="amount of new stars"
						stroke='#adaaef'
						strokeWidth={1}
						dot={false}
						legendType='star'
					/>
				</LineChart>
			</ResponsiveContainer>
		)
	}
}

export default StarHistoryGraph;