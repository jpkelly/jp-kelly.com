import React from 'react';

function Articles(props) {
  return (
    <div className="container mx-auto flex items-center py-5">
      <div className="mx-auto container items-center bg-red-900">
        <h2 className="text-2xl bg-black">Articles</h2>
        <p>
          Drake Equation ship of the imagination circumnavigated take root and flourish Euclid realm
          of the galaxies. Stirred by starlight kindling the energy hidden in matter from which we
          spring a mote of dust suspended in a sunbeam muse about courage of our questions. Bits of
          moving fluff the carbon in our apple pies paroxysm of global death hundreds of thousands a
          still more glorious dawn awaits intelligent beings and billions upon billions upon
          billions upon billions upon billions upon billions upon billions.
        </p>
        <div className="bg-yellow-900">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => alert('hello, world')}
          >
            Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default Articles;
