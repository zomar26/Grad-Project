export function setupPuckerDebug(puckerPass) {

  window.puckerTweak = {
    wrinkleFreq: 3.0,
    wrinkleAmp: 0.025,
    blurAmount: 0.22,
    desaturation: 0.10,
    traction: 0.0,

    apply() {

      const p = puckerPass;
      if (!p) return;
      const u = p.uniforms || (p.material && p.material.uniforms);
      if (!u) return;

      if (u.wrinkleFreq)
        u.wrinkleFreq.value = this.wrinkleFreq;

      if (u.wrinkleAmp)
        u.wrinkleAmp.value = this.wrinkleAmp;
         
      if (u.blurAmount)
        u.blurAmount.value = this.blurAmount;
         
      if (u.desaturation)
        u.desaturation.value = this.desaturation;

      if (u.traction)
        u.traction.value = this.traction;

      if (p.material && p.material.uniforms
        
      ) {

        if (p.material.uniforms.wrinkleFreq)
          p.material.uniforms.wrinkleFreq.value = this.wrinkleFreq;
           

        if (p.material.uniforms.wrinkleAmp)
          p.material.uniforms.wrinkleAmp.value = this.wrinkleAmp;
           

        if (p.material.uniforms.blurAmount)
          p.material.uniforms.blurAmount.value = this.blurAmount;
           

        if (p.material.uniforms.desaturation)
          p.material.uniforms.desaturation.value = this.desaturation;
           

        if (p.material.uniforms.traction)
          p.material.uniforms.traction.value = this.traction;
           
      }

      console.log(
        "Applied pucker tweaks:",
        this
      );
    }
  };
}