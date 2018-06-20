<template>
    
        <div class="loading-page" v-if="loading>0">
            <div class="bubblingG">
                <span id="bubblingG_1">
                </span>
                <span id="bubblingG_2">
                </span>
                <span id="bubblingG_3">
                </span>
            </div>
        </div>
</template>

<script>
export default {
    data() {
        return {
            loading: 0,
        }
    },
    methods: {
        start() {
            this.loading++
        },
        finish() {
            this.loading--
        },
    },

}
</script>

<style scoped>



.loading-page{
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #efefef;
    z-index: 1    
}

.bubblingG {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
	text-align: center;
	width:78px;
	height:49px;
	margin: auto;
}

.bubblingG span {
	display: inline-block;
	vertical-align: middle;
	width: 10px;
	height: 10px;
	margin: 24px auto;
	background: #424242;
	border-radius: 49px;
		-o-border-radius: 49px;
		-ms-border-radius: 49px;
		-webkit-border-radius: 49px;
		-moz-border-radius: 49px;
	animation: bubblingG 1.5s infinite alternate;
		-o-animation: bubblingG 1.5s infinite alternate;
		-ms-animation: bubblingG 1.5s infinite alternate;
		-webkit-animation: bubblingG 1.5s infinite alternate;
		-moz-animation: bubblingG 1.5s infinite alternate;
}

#bubblingG_1 {
	animation-delay: 0s;
		-o-animation-delay: 0s;
		-ms-animation-delay: 0s;
		-webkit-animation-delay: 0s;
		-moz-animation-delay: 0s;
}

#bubblingG_2 {
	animation-delay: 0.45s;
		-o-animation-delay: 0.45s;
		-ms-animation-delay: 0.45s;
		-webkit-animation-delay: 0.45s;
		-moz-animation-delay: 0.45s;
}

#bubblingG_3 {
	animation-delay: 0.9s;
		-o-animation-delay: 0.9s;
		-ms-animation-delay: 0.9s;
		-webkit-animation-delay: 0.9s;
		-moz-animation-delay: 0.9s;
}



@keyframes bubblingG {
	0% {
		width: 10px;
		height: 10px;
		background-color:#424242;
		transform: translateY(0);
	}

	100% {
		width: 23px;
		height: 23px;
		background-color:#efefef;
		transform: translateY(-20px);
	}
}

@-o-keyframes bubblingG {
	0% {
		width: 10px;
		height: 10px;
		background-color:#424242;
		-o-transform: translateY(0);
	}

	100% {
		width: 23px;
		height: 23px;
		background-color:#efefef;
		-o-transform: translateY(-20px);
	}
}

@-ms-keyframes bubblingG {
	0% {
		width: 10px;
		height: 10px;
		background-color:#424242;
		-ms-transform: translateY(0);
	}

	100% {
		width: 23px;
		height: 23px;
		background-color:#efefef;
		-ms-transform: translateY(-20px);
	}
}

@-webkit-keyframes bubblingG {
	0% {
		width: 10px;
		height: 10px;
		background-color:#424242;
		-webkit-transform: translateY(0);
	}

	100% {
		width: 23px;
		height: 23px;
		background-color:#efefef;
		-webkit-transform: translateY(-20px);
	}
}

@-moz-keyframes bubblingG {
	0% {
		width: 10px;
		height: 10px;
		background-color:#424242;
		-moz-transform: translateY(0);
	}

	100% {
		width: 23px;
		height: 23px;
		background-color:#efefef;
		-moz-transform: translateY(-20px);
	}
}
</style>