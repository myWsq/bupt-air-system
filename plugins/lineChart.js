import { Line, mixins } from 'vue-chartjs';
import Vue from 'vue';
const LineChart = {
	extends: Line,
	mixins: [ mixins.reactiveProp ],
	props: [ 'chartData', 'options' ],
	mounted() {
		this.renderChart(this.chartData, this.options);
	}
};

Vue.component('line-chart', LineChart);
