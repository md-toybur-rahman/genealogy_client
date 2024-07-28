import React from 'react';

const DecisionTree = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-96">
        {/* Day node */}
        <div className="flex justify-center items-center mb-8">
          <div className="bg-gray-200 p-4 rounded-md shadow-md transform rotate-45">
            <div className="transform -rotate-45">Day</div>
          </div>
        </div>

        {/* Working and Holiday nodes */}
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 p-4 rounded-md shadow-md transform rotate-45">
              <div className="transform -rotate-45">Working</div>
            </div>
            <div className="h-16 w-0.5 bg-black"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 p-4 rounded-md shadow-md transform rotate-45">
              <div className="transform -rotate-45">Holiday</div>
            </div>
            <div className="h-16 w-0.5 bg-black"></div>
          </div>
        </div>

        {/* Outlook nodes for Working and Holiday */}
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 p-4 rounded-md shadow-md transform rotate-45">
              <div className="transform -rotate-45">Outlook</div>
            </div>
            <div className="h-16 w-0.5 bg-black"></div>
            <div className="flex justify-between mt-4 w-48">
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 p-4 rounded-md shadow-md transform rotate-45">
                  <div className="transform -rotate-45">Rainy</div>
                </div>
                <div className="mt-2">Go to office</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 p-4 rounded-md shadow-md transform rotate-45">
                  <div className="transform -rotate-45">Sunny</div>
                </div>
                <div className="mt-2">Go to office</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 p-4 rounded-md shadow-md transform rotate-45">
              <div className="transform -rotate-45">Outlook</div>
            </div>
            <div className="h-16 w-0.5 bg-black"></div>
            <div className="flex justify-between mt-4 w-48">
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 p-4 rounded-md shadow-md transform rotate-45">
                  <div className="transform -rotate-45">Rainy</div>
                </div>
                <div className="mt-2">Watch TV</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 p-4 rounded-md shadow-md transform rotate-45">
                  <div className="transform -rotate-45">Sunny</div>
                </div>
                <div className="mt-2">Go to Picnic</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionTree;
