(function() {
    window.IDGenerator = function IDGenerator() {

        this.length = 8;
        this.timestamp = +new Date;

        var _getRandomInt = function( min, max ) {
            return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
        }

        this.generate = function() {
            var ts = this.timestamp.toString();
            var parts = ts.split( "" ).reverse();
            var id = "";

            for( var i = 0; i < this.length; ++i ) {
                var index = _getRandomInt( 0, parts.length - 1 );
                id += parts[index];
            }

            return id;
        }

    }

    window.EventEmitter = class EventEmitter {
        constructor() {
            this.events = {};
        }

        emit(eventName, data) {
            const event = this.events[eventName];
            if( event ) {
                event.forEach(fn => {
                    fn.call(null, data);
                });
            }
        }

        subscribe(eventName, fn) {
            if(!this.events[eventName]) {
                this.events[eventName] = [];
            }

            this.events[eventName].push(fn);
            return () => {
                this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
            }
        }

    }

})();