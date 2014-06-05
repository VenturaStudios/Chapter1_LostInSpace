
(function() {
    function Sprite(url, pos, size, speed, frames, dir, once) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this.expectedSize = [this.size[0],this.size[1]];
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
        this.setFrameChangeCallback = (function(cb){
            this.frameChangeCallback = cb;
            console.log('applied',cb, this.frameChangeCallback, this)
        }).bind(this);
        this.frameChangeCallback = function(){}
    };

    Sprite.prototype = {
        update: function(dt) {
            this._index += this.speed*dt;
        },
        getSize:function(){
            return this.expectedSize;
        },
        resize: function(width, height){
            this.expectedSize = [width,height];
        },

        render: function(ctx,angle, translation) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                this.frameChangeCallback(frame);
                
                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }
            if(angle){
                ctx.rotate(angle * Math.PI);                 
            }

            var origX = 0;
            var origY = 0;
            if(translation){
                origX -= translation[0];
                origY -= translation[1];
            }

            ctx.drawImage(resources.get(this.url),
                        Math.round(x),  Math.round(y),
                          this.size[0], this.size[1],
                          origX, origY,
                          this.expectedSize[0], this.expectedSize[1]);
        }
    };

    window.Sprite = Sprite;
})();