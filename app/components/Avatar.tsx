import React from 'react';

const EYES = ["Awe.svg", "Driven.svg", "FACE.svg", "Hectic.svg", "Monster.svg"];
const CLOTHES = ["BODY.svg", "Gaming.svg", "Macbook.svg", "Paper.svg", "Shirt and Coat.svg", "Striped Pocket Tee.svg", "Thunder T-Shirt.svg"];
const HEAD_WOMEN = ["Hijab.svg", "Long Bangs.svg", "Long Curly.svg"];
const HEAD_MEN = ["Bantu Knots.svg", "Flat Top Long.svg", "Mohawk 2.svg", "No Hair 1.svg", "Pomp.svg", "Short 5.svg", "Twists.svg"];
const ACCESSORIES = ["Sunglasses.svg", null, null, null]; // 25% chance for sunglasses

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
}

export function Avatar({ seed, salt = "" }: { seed: string; salt?: string }) {
  const hash = simpleHash(seed + salt);
  
  const gender = hash % 2 === 0 ? "men" : "women";
  const headArray = gender === "men" ? HEAD_MEN : HEAD_WOMEN;
  const head = headArray[hash % headArray.length];
  
  const clothes = CLOTHES[(hash >> 1) % CLOTHES.length];
  const eyes = EYES[(hash >> 2) % EYES.length];
  const accessory = ACCESSORIES[(hash >> 3) % ACCESSORIES.length];

  return (
    <div className="relative shrink-0 flex items-end justify-center" style={{ width: "80px", height: "150px" }}>
      {/* Clothes / Body */}
      <img 
        src={`/clothes/${clothes}`} 
        className="absolute max-w-none"
        style={{ bottom: "0px", left: "50%", transform: "translateX(-50%)", width: "96px" }}
        alt="clothes"
      />
      
      {/* Head */}
      <div
        className="absolute z-10"
        style={{
          bottom: "72px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60px",
          height: "72px"
        }}
      >
        <img 
          src={`/head_${gender}/${head}`}
          className="absolute inset-0 w-full h-full object-contain"
          alt="head"
        />
        
        {/* Eyes */}
        <img 
          src={`/eyes/${eyes}`}
          className="absolute object-contain"
          style={{
            top: "57%",
            left: "64%",
            transform: "translate(-50%, -50%)",
            width: "34px"
          }}
          alt="eyes"
        />
        
        {/* Accessory */}
        {accessory && (
          <img 
            src={`/Accessories/${accessory}`}
            className="absolute object-contain"
            style={{
              top: "54%",
              left: "54%",
              transform: "translate(-50%, -50%)",
              width: "40px"
            }}
            alt="accessory"
          />
        )}
      </div>
    </div>
  );
}

